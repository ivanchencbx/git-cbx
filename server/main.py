from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, portal, survey, accounting, career, supply
from . import models, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="cbx.life API",
    description="Backend API for cbx.life platform",
    version="0.1.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(portal.router)
app.include_router(survey.router)
app.include_router(accounting.router)
app.include_router(career.router)
app.include_router(supply.router)

@app.get("/")
async def root():
    return {"message": "Welcome to cbx.life API (慈贝瑆.生活)"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
