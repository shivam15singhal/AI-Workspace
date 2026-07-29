from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.api import google_calendar
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.document import router as document_router
from app.api.message import router as message_router
from app.api.workspace import router as workspace_router
from app.api.workspace_memory import (
    router as workspace_memory_router,
)
from app.core.config import settings
from app.database.database import Base, engine



app = FastAPI(
    title="AI Workspace API",
    description="Backend API for AI Workspace.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(document_router)
app.include_router(workspace_router)
app.include_router(workspace_memory_router)
app.include_router(google_calendar.router)


@app.get("/", tags=["Health"])
def home() -> dict[str, str]:
    return {
        "message": "AI Workspace Backend Running 🚀",
    }


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
    }