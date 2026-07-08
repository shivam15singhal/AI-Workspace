from fastapi import FastAPI

from app.database.database import Base, engine
from app.models import user
from app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Workspace API",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "AI Workspace Backend Running 🚀"
    }