from fastapi import FastAPI

from app.database.database import Base, engine
import app.models
Base.metadata.create_all(bind=engine)
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.message import router as message_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.workspace import (
    router as workspace_router,
)
from app.api.document import router as document_router

app = FastAPI(
    title="AI Workspace API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(document_router)
app.include_router(
    workspace_router,
)


@app.get("/")
def home():
    return {
        "message": "AI Workspace Backend Running 🚀"
    }