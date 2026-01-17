from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/supply",
    tags=["supply"],
)

@router.get("/items", response_model=List[schemas.SupplyItem])
def get_items(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    return db.query(models.SupplyItem).filter(models.SupplyItem.user_id == user.id).order_by(models.SupplyItem.status.desc(), models.SupplyItem.created_at.desc()).all()

@router.post("/items", response_model=schemas.SupplyItem)
def create_item(
    item: schemas.SupplyItemCreate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    
    db_item = models.SupplyItem(
        user_id=user.id,
        name=item.name,
        category=item.category,
        status=item.status,
        quantity=item.quantity
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/items/{item_id}", response_model=schemas.SupplyItem)
def update_item_status(
    item_id: int,
    status: str,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    item = db.query(models.SupplyItem).filter(models.SupplyItem.id == item_id, models.SupplyItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.status = status
    db.commit()
    db.refresh(item)
    return item

@router.delete("/items/{item_id}")
def delete_item(
    item_id: int,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    item = db.query(models.SupplyItem).filter(models.SupplyItem.id == item_id, models.SupplyItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"ok": True}
