from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/career",
    tags=["career"],
)

@router.get("/profile", response_model=schemas.CareerProfile)
def get_profile(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    profile = db.query(models.CareerProfile).filter(models.CareerProfile.user_id == user.id).first()
    if not profile:
        # Create empty profile if none exists
        profile = models.CareerProfile(user_id=user.id, skills=[], experience=[], education=[])
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=schemas.CareerProfile)
def update_profile(
    profile_data: schemas.CareerProfileCreate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    profile = db.query(models.CareerProfile).filter(models.CareerProfile.user_id == user.id).first()
    
    profile.headline = profile_data.headline
    profile.skills = profile_data.skills
    profile.experience = profile_data.experience
    profile.education = profile_data.education
    
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/applications", response_model=List[schemas.JobApplication])
def get_applications(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    return db.query(models.JobApplication).filter(models.JobApplication.user_id == user.id).order_by(models.JobApplication.applied_date.desc()).all()

@router.post("/applications", response_model=schemas.JobApplication)
def create_application(
    app_data: schemas.JobApplicationCreate,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_app = models.JobApplication(
        user_id=user.id,
        company=app_data.company,
        position=app_data.position,
        status=app_data.status,
        salary_range=app_data.salary_range,
        notes=app_data.notes
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.patch("/applications/{app_id}", response_model=schemas.JobApplication)
def update_application_status(
    app_id: int,
    status: str,
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    app = db.query(models.JobApplication).filter(models.JobApplication.id == app_id, models.JobApplication.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.status = status
    db.commit()
    db.refresh(app)
    return app
