from fastapi import APIRouter, Depends
from .. import auth

router = APIRouter(
    prefix="/portal",
    tags=["portal"],
)

@router.get("/stats")
def get_portal_stats(current_user: dict = Depends(auth.get_current_user)):
    return {
        "greeting": f"Hello, {current_user.email}",
        "modules": [
            {"id": "survey", "name": "SurveyStar", "status": "active", "notifications": 2},
            {"id": "accounting", "name": "Accounting", "status": "active", "notifications": 0},
            {"id": "career", "name": "CareerDev", "status": "active", "notifications": 5},
            {"id": "supply", "name": "SupplyStar", "status": "active", "notifications": 1},
        ]
    }
