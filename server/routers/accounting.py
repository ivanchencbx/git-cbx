from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/accounting",
    tags=["accounting"],
)

@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(database.get_db)):
    cats = db.query(models.Category).all()
    # Seed default categories if empty
    if not cats:
        defaults = [
            {"name": "Food", "icon": "Utensils"},
            {"name": "Transport", "icon": "Car"},
            {"name": "Housing", "icon": "Home"},
            {"name": "Salary", "icon": "Banknote"},
            {"name": "Entertainment", "icon": "Film"},
            {"name": "Utilities", "icon": "Zap"},
            {"name": "Shopping", "icon": "ShoppingBag"},
            {"name": "Health", "icon": "Heart"},
            {"name": "Other", "icon": "MoreHorizontal"},
        ]
        for c in defaults:
            db_cat = models.Category(name=c["name"], icon=c["icon"])
            db.add(db_cat)
        db.commit()
        cats = db.query(models.Category).all()
    return cats

@router.get("/expenses", response_model=List[schemas.Expense])
def get_expenses(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    return db.query(models.Expense).filter(models.Expense.user_id == user.id).order_by(models.Expense.date.desc()).all()

@router.post("/expenses", response_model=schemas.Expense)
def create_expense(
    expense: schemas.ExpenseCreate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    
    # Store amount in cents if receiving float dollars (handled in frontend usually, but good to be consistent)
    # Here we assume schema input is direct amount
    
    db_expense = models.Expense(
        user_id=user.id,
        category_id=expense.category_id,
        amount=int(expense.amount * 100), # Convert to cents
        description=expense.description,
        date=expense.date,
        is_income=expense.is_income
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/summary")
def get_summary(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    expenses = db.query(models.Expense).filter(models.Expense.user_id == user.id).all()
    
    total_income = sum(e.amount for e in expenses if e.is_income) / 100.0
    total_expense = sum(e.amount for e in expenses if not e.is_income) / 100.0
    balance = total_income - total_expense
    
    return {
        "income": total_income,
        "expense": total_expense,
        "balance": balance
    }
@router.patch("/expenses/{expense_id}", response_model=schemas.Expense)
def update_expense(
    expense_id: int,
    expense_update: schemas.ExpenseCreate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == user.id
    ).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Update expense fields
    expense.category_id = expense_update.category_id
    expense.amount = int(expense_update.amount * 100)
    expense.description = expense_update.description
    expense.date = expense_update.date
    expense.is_income = expense_update.is_income
    
    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == user.id
    ).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    
    return {"message": "Expense deleted successfully"}