from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    # Support login with either email or phone
    username: str # This can be email or phone
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

from typing import List, Any, Dict

class Question(BaseModel):
    id: str
    type: str # text, multiple_choice, checkbox, rating
    label: str
    options: Optional[List[str]] = None
    required: bool = False

class SurveyBase(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[Question]

class SurveyCreate(SurveyBase):
    pass

class Survey(SurveyBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class ResponseCreate(BaseModel):
    answers: Dict[str, Any]

class Response(ResponseCreate):
    id: int
    survey_id: int
    created_at: datetime

    class Config:
        orm_mode = True

from datetime import datetime

class Category(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None

    class Config:
        orm_mode = True

class ExpenseBase(BaseModel):
    amount: float # Input as float, stored as int cents in DB logic
    description: str
    date: datetime
    is_income: bool = False
    category_id: int

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    category: Optional[Category] = None

    class Config:
        orm_mode = True

# Career Models
class CareerProfileBase(BaseModel):
    headline: Optional[str] = None
    skills: List[str] = []
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []

class CareerProfileCreate(CareerProfileBase):
    pass

class CareerProfile(CareerProfileBase):
    id: int
    user_id: int
    updated_at: datetime
    
    class Config:
        orm_mode = True

class JobApplicationBase(BaseModel):
    company: str
    position: str
    status: str = "Applied"
    salary_range: Optional[str] = None
    notes: Optional[str] = None
    application_date: datetime = datetime.now()

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        orm_mode = True

# Supply Models
class SupplyItemBase(BaseModel):
    name: str
    category: Optional[str] = "General"
    quantity: int = 1
    # Status: "In Stock", "To Buy", "To Buy (Urgent)", "Ordered", "Received"
    status: str = "In Stock"

class SupplyItemCreate(SupplyItemBase):
    pass

class SupplyItem(SupplyItemBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        orm_mode = True

