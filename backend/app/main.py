from fastapi import FastAPI

from app.database.database import engine
from app.database.database import Base

from app.models import user

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Workspace API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "AI Workspace Backend Running 🚀"
    }