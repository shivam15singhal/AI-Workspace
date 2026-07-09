from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.models.user import User
from fastapi import HTTPException


def create_chat(db: Session, current_user: User):
    chat = Chat(
        title="New Chat",
        user_id=current_user.id,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat

def get_user_chats(db: Session, current_user: User):
    return (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.updated_at.desc())
        .all()
    )

def get_chat_by_id(
    db: Session,
    chat_id: int,
    current_user: User,
):
    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return chat

def update_chat(
    db: Session,
    chat_id: int,
    title: str,
    current_user: User,
):
    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    chat.title = title

    db.commit()
    db.refresh(chat)

    return chat