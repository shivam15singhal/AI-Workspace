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