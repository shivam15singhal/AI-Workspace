from sqlalchemy.orm import Session

from app.enums.message_role import MessageRole
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from app.services.chat_service import get_owned_chat
from app.llm.service import LLMService


def create_message(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Message:

    # Verify chat ownership
    get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    # Save user's message
    user_message = Message(
        chat_id=message_data.chat_id,
        role=MessageRole.USER,
        content=message_data.content,
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # Build conversation
    conversation = get_conversation_messages(
        db=db,
        chat_id=message_data.chat_id,
    )

    # Generate AI response
    llm = LLMService()

    ai_response = llm.generate(conversation)

    # Save assistant message
    assistant_message = Message(
        chat_id=message_data.chat_id,
        role=MessageRole.ASSISTANT,
        content=ai_response,
    )

    db.add(assistant_message)
    db.commit()

    return assistant_message

def get_chat_messages(
    db: Session,
    chat_id: int,
    current_user: User,
) -> list[Message]:


    # Verify ownership
    get_owned_chat(
        db=db,
        chat_id=chat_id,
        current_user=current_user,
    )

    return (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
        .all()
    )

def get_conversation_messages(
    db: Session,
    chat_id: int,
) -> list[dict]:
    """
    Convert database messages into Ollama/OpenAI format.
    """

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    conversation = [
        {
            "role": "system",
            "content": (
                "You are AI Workspace, a helpful AI assistant. "
                "Answer clearly and accurately."
            ),
        }
    ]

    for message in messages:
        conversation.append(
            {
                "role": message.role.value,
                "content": message.content,
            }
        )

    return conversation