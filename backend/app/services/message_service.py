from sqlalchemy.orm import Session

from app.enums.message_role import MessageRole
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from app.services.chat_service import get_owned_chat


def create_message(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Message:

    get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    message = Message(
        chat_id=message_data.chat_id,
        role=MessageRole.USER,
        content=message_data.content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message