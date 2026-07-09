from fastapi import FastAPI

from app.database.database import Base, engine
import app.models
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.message import router as message_router
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Workspace API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(message_router)


@app.get("/")
def home():
    return {
        "message": "AI Workspace Backend Running 🚀"
    }