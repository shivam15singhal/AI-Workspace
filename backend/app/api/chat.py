from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatResponse, ChatUpdate
from app.services.chat_service import create_chat,get_user_chats, get_chat_by_id, update_chat,delete_chat

from typing import List


router = APIRouter(
    prefix="/api/chats",
    tags=["Chats"],
)


@router.post("", response_model=ChatResponse)
def create_new_chat(
    chat_data: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_chat(
        db=db,
        current_user=current_user,
        workspace_id=chat_data.workspace_id,
    )

@router.get("", response_model=List[ChatResponse])
def get_chats(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_chats(
        db=db,
        current_user=current_user,
        workspace_id=workspace_id,
    )

@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_chat_by_id(
        db,
        chat_id,
        current_user,
    )

@router.patch("/{chat_id}", response_model=ChatResponse)
def rename_chat(
    chat_id: int,
    chat_data: ChatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_chat(
        db=db,
        chat_id=chat_id,
        title=chat_data.title,
        current_user=current_user,
    )

@router.delete("/{chat_id}")
def remove_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_chat(
        db=db,
        chat_id=chat_id,
        current_user=current_user,
    )