from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta
from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        phone=user.phone,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(database.get_db)):
    # Username in form_data can be email or phone
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        # Try phone
        user = db.query(models.User).filter(models.User.phone == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email or user.phone}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
@router.get("/me", response_model=schemas.User)
def get_current_user_info(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get current authenticated user's information"""
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Update current user's information"""
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Only update provided fields
    if user_update.full_name:
        user.full_name = user_update.full_name
    if user_update.phone:
        # Check if phone is already taken
        existing = db.query(models.User).filter(
            models.User.phone == user_update.phone,
            models.User.id != user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Phone already registered")
        user.phone = user_update.phone
    
    db.commit()
    db.refresh(user)
    return user