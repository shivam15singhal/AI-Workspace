from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.workspace import Workspace
from app.models.chat import Chat
from app.models.user import User
from app.llm.service import LLMService

llm_service = LLMService()

def get_owned_chat(
    db: Session,
    chat_id: int,
    current_user: User,
) -> Chat:
    
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


def create_chat(
    db: Session,
    current_user: User,
    workspace_id: int,
) -> Chat:

    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id,
        )
        .first()
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found",
        )

    chat = Chat(
        title="New Chat",
        user_id=current_user.id,
        workspace_id=workspace.id,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


def get_user_chats(
    db: Session,
    current_user: User,
    workspace_id: int,
) -> list[Chat]:

    return (
        db.query(Chat)
        .filter(
            Chat.user_id == current_user.id,
            Chat.workspace_id == workspace_id,
        )
        .order_by(Chat.updated_at.desc())
        .all()
    )

def get_chat_by_id(
    db: Session,
    chat_id: int,
    current_user: User,
) -> Chat:
    return get_owned_chat(
        db,
        chat_id,
        current_user,
    )


def update_chat(
    db: Session,
    chat_id: int,
    title: str,
    current_user: User,
) -> Chat:
    chat = get_owned_chat(
        db,
        chat_id,
        current_user,
    )

    chat.title = title

    db.commit()
    db.refresh(chat)

    return chat


def delete_chat(
        
    db: Session,
    chat_id: int,
    current_user: User,
) -> dict:
    chat = get_owned_chat(
        db,
        chat_id,
        current_user,
    )

    db.delete(chat)
    db.commit()

    return {
        "message": "Chat deleted successfully"
    } 

def generate_chat_title(
    db: Session,
    chat: Chat,
    first_message: str,
) -> Chat:

    if chat.title != "New Chat":
        return chat

    try:
        title = llm_service.generate_title(first_message)

        title = (
            title.strip()
            .replace("\n", " ")
            .replace("#", "")
            .replace("*", "")
        )

        title = " ".join(title.split())  # remove extra spaces

        if not title:
            title = "New Chat"

        chat.title = title[:100]

    except Exception:
        chat.title = (
            first_message[:40] + "..."
            if len(first_message) > 40
            else first_message
        )

    db.commit()
    db.refresh(chat)

    return chat