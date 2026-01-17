from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

from sqlalchemy import ForeignKey, JSON
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    questions = Column(JSON) # List of questions: {id, type, label, options, required}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="surveys")
    responses = relationship("Response", back_populates="survey")

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"))
    answers = Column(JSON) # Key-value mapping of Question ID -> Answer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    survey = relationship("Survey", back_populates="responses")

# Update User model to include surveys relationship
User.surveys = relationship("Survey", back_populates="owner")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    icon = Column(String, nullable=True) # Lucide icon name or emoji

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    amount = Column(Integer) # Stored in cents/smallest unit
    description = Column(String)
    date = Column(DateTime)
    is_income = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


    user = relationship("User", back_populates="expenses")
    category = relationship("Category")

User.expenses = relationship("Expense", back_populates="user")

class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    headline = Column(String, nullable=True) # e.g. "Senior Python Developer"
    skills = Column(JSON) # List of strings ["Python", "React"]
    experience = Column(JSON) # List of dicts {company, role, duration, description}
    education = Column(JSON) # List of dicts {school, degree, year}
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="career_profile")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company = Column(String)
    position = Column(String)
    status = Column(String, default="Applied") # Applied, Interviewing, Offer, Rejected
    salary_range = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="job_applications")

User.career_profile = relationship("CareerProfile", uselist=False, back_populates="user")
User.job_applications = relationship("JobApplication", back_populates="user")

class SupplyItem(Base):
    __tablename__ = "supply_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    category = Column(String, nullable=True) # e.g. Food, Hygiene, Tools
    status = Column(String, default="TO_BUY") # TO_BUY, IN_STOCK
    quantity = Column(String, nullable=True) # e.g. "2 packs", "5kg"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="supply_items")

User.supply_items = relationship("SupplyItem", back_populates="user")
