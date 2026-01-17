from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(
    prefix="/surveys",
    tags=["surveys"],
)

@router.post("/", response_model=schemas.Survey)
def create_survey(
    survey: schemas.SurveyCreate, 
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Find user id
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    
    # Convert Pydantic list of models to JSON-compatible list of dicts
    questions_json = [q.dict() for q in survey.questions]

    db_survey = models.Survey(
        title=survey.title,
        description=survey.description,
        questions=questions_json,
        owner_id=user.id
    )
    db.add(db_survey)
    db.commit()
    db.refresh(db_survey)
    return db_survey

@router.get("/", response_model=List[schemas.Survey])
def list_my_surveys(
    current_user: dict = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    return db.query(models.Survey).filter(models.Survey.owner_id == user.id).all()

@router.get("/{survey_id}", response_model=schemas.Survey)
def get_survey(survey_id: int, db: Session = Depends(database.get_db)):
    # Public access allowed for taking the survey
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey

@router.post("/{survey_id}/responses", response_model=schemas.Response)
def submit_response(
    survey_id: int, 
    response: schemas.ResponseCreate, 
    db: Session = Depends(database.get_db)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    db_response = models.Response(
        survey_id=survey_id,
        answers=response.answers
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response
