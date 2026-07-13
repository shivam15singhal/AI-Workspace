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
from app.services.retrieval_service import retrieve_context

llm_service = LLMService()


def save_user_message(
    db: Session,
    chat_id: int,
    content: str,
) -> Message:
    """
    Save a user's message.
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
    Save the assistant's response.
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


def build_conversation(
    db: Session,
    chat_id: int,
    context: str,
) -> list[dict]:
    """
    Build the conversation sent to the LLM.
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
            "content": f"""
You are AI Workspace.

You are a Retrieval-Augmented Generation (RAG) assistant.

Rules:
- Answer ONLY using the provided context.
- If the answer is not found in the context, reply exactly:
  "I couldn't find that information in the uploaded documents."
- Never use outside knowledge.
- Never guess.
- Never hallucinate.
- Keep answers concise.

Context:

{context}
""",
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


def generate_ai_response(
    conversation: list[dict],
) -> str:
    """
    Generate a complete AI response.
    """

    return llm_service.generate(conversation)


def create_message(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Message:
    """
    Generate a complete (non-streaming) AI response.
    """

    chat = get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    save_user_message(
        db=db,
        chat_id=message_data.chat_id,
        content=message_data.content,
    )

    generate_chat_title(
        db=db,
        chat=chat,
        first_message=message_data.content,
    )

    context, sources = retrieve_context(
        query=message_data.content,
        user_id=current_user.id,
    )

    conversation = build_conversation(
        db=db,
        chat_id=message_data.chat_id,
        context=context,
    )

    ai_response = generate_ai_response(conversation)

    if sources:
        ai_response += "\n\n---\n\nSources:\n"

        for source in sources:
            ai_response += f"- {source}\n"

    return save_assistant_message(
        db=db,
        chat_id=message_data.chat_id,
        content=ai_response,
    )


def get_chat_messages(
    db: Session,
    chat_id: int,
    current_user: User,
) -> list[Message]:
    """
    Return all messages for a chat.
    """

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
    Stream AI response.
    """

    return llm_service.stream(conversation)


def stream_ai_response(
    db: Session,
    message_data: MessageCreate,
    current_user: User,
) -> Generator[str, None, None]:
    """
    Stream an AI response while saving it afterwards.
    """

    chat = get_owned_chat(
        db=db,
        chat_id=message_data.chat_id,
        current_user=current_user,
    )

    save_user_message(
        db=db,
        chat_id=message_data.chat_id,
        content=message_data.content,
    )

    generate_chat_title(
        db=db,
        chat=chat,
        first_message=message_data.content,
    )

    context, sources = retrieve_context(
        query=message_data.content,
        user_id=current_user.id,
    )

    conversation = build_conversation(
        db=db,
        chat_id=message_data.chat_id,
        context=context,
    )

    full_response = ""

    for chunk in generate_ai_response_stream(conversation):
        full_response += chunk
        yield chunk

    if sources:
        full_response += "\n\n---\n\nSources:\n"

        for source in sources:
            full_response += f"- {source}\n"

    save_assistant_message(
        db=db,
        chat_id=message_data.chat_id,
        content=full_response,
    )