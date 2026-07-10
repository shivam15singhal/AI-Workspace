from sqlalchemy.orm import Session

from app.enums.message_role import MessageRole
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from app.services.chat_service import get_owned_chat
from app.llm.service import LLMService

def save_user_message(
    db: Session,
    chat_id: int,
    content: str,
) -> Message:
    

    message = Message(
        chat_id=chat_id,
        role=MessageRole.USER,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message

def save_assistant_message(
    db: Session,
    chat_id: int,
    content: str,
) -> Message:
    

    message = Message(
        chat_id=chat_id,
        role=MessageRole.ASSISTANT,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message

def generate_ai_response(
    conversation: list[dict],
) -> str:
    llm_service = LLMService()

    return llm_service.generate(conversation)

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

    save_user_message(
        db=db,
        chat_id=message_data.chat_id,
        content=message_data.content,
    )

    conversation = get_conversation_messages(
        db=db,
        chat_id=message_data.chat_id,
    )

    ai_response = generate_ai_response(conversation)

    
    assistant_message = save_assistant_message(
        db=db,
        chat_id=message_data.chat_id,
        content=ai_response,
    )

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