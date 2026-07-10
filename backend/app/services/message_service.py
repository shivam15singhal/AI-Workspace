from sqlalchemy.orm import Session
from typing import Generator

from app.enums.message_role import MessageRole
from app.llm.service import LLMService
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from app.services.chat_service import (
    generate_chat_title,
    get_owned_chat,
)

# Create one LLM instance for the whole module
llm_service = LLMService()


def save_user_message(
    db: Session,
    chat_id: int,
    content: str,
) -> Message:
    """
    Save a user's message to the database.
    """
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
    """
    Save the AI assistant's response to the database.
    """
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
    """
    Generate an AI response using the configured LLM.
    """
    return llm_service.generate(conversation)


def get_conversation_messages(
    db: Session,
    chat_id: int,
) -> list[dict]:
    """
    Convert database messages into Ollama/OpenAI chat format.
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


def create_message(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Message:
    """
    Complete message pipeline.

    1. Verify chat ownership
    2. Save user message
    3. Generate chat title (first message only)
    4. Build conversation
    5. Generate AI response
    6. Save assistant response
    7. Return assistant response
    """

    # Verify ownership and fetch chat
    chat = get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    # Save user's message
    save_user_message(
        db=db,
        chat_id=message_data.chat_id,
        content=message_data.content,
    )

    # Generate title if it's a new chat
    generate_chat_title(
        db=db,
        chat=chat,
        first_message=message_data.content,
    )

    # Build conversation history
    conversation = get_conversation_messages(
        db=db,
        chat_id=message_data.chat_id,
    )

    # Generate AI response
    ai_response = generate_ai_response(conversation)

    # Save assistant message
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
    """
    Return all messages for a chat.
    """

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

def generate_ai_response_stream(
    conversation: list[dict],
) -> Generator[str, None, None]:
    """
    Stream an AI response.
    """

    return llm_service.stream(conversation)


def stream_ai_response(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Generator[str, None, None]:
    """
    Stream an AI response while collecting the full text.
    """

    # Verify ownership
    chat = get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    # Save user message
    save_user_message(
        db=db,
        chat_id=message_data.chat_id,
        content=message_data.content,
    )

    # Generate title
    generate_chat_title(
        db=db,
        chat=chat,
        first_message=message_data.content,
    )

    # Build conversation
    conversation = get_conversation_messages(
        db=db,
        chat_id=message_data.chat_id,
    )

    full_response = ""

    for chunk in generate_ai_response_stream(conversation):
        full_response += chunk
        yield chunk

    # Save assistant response after streaming completes
    save_assistant_message(
        db=db,
        chat_id=message_data.chat_id,
        content=full_response,
    )