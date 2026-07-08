from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatResponse
from app.services.chat_service import create_chat

router = APIRouter(
    prefix="/api/chats",
    tags=["Chats"],
)


@router.post("", response_model=ChatResponse)
def create_new_chat(
    _: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_chat(db, current_user)