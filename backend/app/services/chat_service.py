from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.models.user import User


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