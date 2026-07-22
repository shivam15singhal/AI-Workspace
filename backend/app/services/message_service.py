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
from app.services.memory_extraction_service import (
    extract_memory,
)
from app.services.prompt_builder import (
    build_prompt,
)
from app.services.workspace_memory_service import (
    create_memory_from_ai,
)
from app.services.summary_service import (
    create_or_update_summary,
)
from app.agents.agent import Agent
llm_service = LLMService()
agent = Agent()


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


def edit_user_message(
    db: Session,
    message_id: int,
    content: str,
    current_user: User,
) -> Message:
    """
    Edit a previous user message and remove
    all conversation messages that came after it.

    This creates a new conversation branch
    starting from the edited prompt.
    """

    message = (
        db.query(Message)
        .filter(
            Message.id == message_id,
            Message.role == MessageRole.USER,
        )
        .first()
    )

    if not message:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="User message not found",
        )

    # Verify that the chat belongs
    # to the authenticated user.
    get_owned_chat(
        db=db,
        chat_id=message.chat_id,
        current_user=current_user,
    )

    content = content.strip()

    if not content:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    # Remove everything after this message.
    #
    # Using the primary-key ID is safer here
    # than created_at because timestamps could
    # theoretically be identical.
    (
        db.query(Message)
        .filter(
            Message.chat_id == message.chat_id,
            Message.id > message.id,
        )
        .delete(
            synchronize_session=False,
        )
    )

    message.content = content

    db.commit()
    db.refresh(message)

    return message

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
    memory = extract_memory(
    message_data.content,
)

    if memory.get("save"):
        create_memory_from_ai(
        db=db,
        workspace_id=chat.workspace_id,
        memory=memory,
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

    conversation = build_prompt(
    db=db,
    chat_id=message_data.chat_id,
    workspace_id=chat.workspace_id,
    user_query=message_data.content,
    rag_context=context,
)

    ai_response = agent.run(
    conversation,
)

    if sources:
        ai_response += "\n\n---\n\nSources:\n"

        for source in sources:
            ai_response += f"- {source}\n"

    assistant_message = save_assistant_message(
    db=db,
    chat_id=message_data.chat_id,
    content=ai_response,
)

    create_or_update_summary(
        db=db,
        chat_id=message_data.chat_id,
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
    memory = extract_memory(
    message_data.content,
)

    if memory.get("save"):
        create_memory_from_ai(
        db=db,
        workspace_id=chat.workspace_id,
        memory=memory,
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

    conversation = build_prompt(
    db=db,
    chat_id=message_data.chat_id,
    workspace_id=chat.workspace_id,
    user_query=message_data.content,
    rag_context=context,
)

    full_response = ""

    for chunk in agent.stream(
    conversation,
):
        full_response += chunk
        yield chunk

    if sources:
        full_response += "\n\n---\n\nSources:\n"

        for source in sources:
            full_response += f"- {source}\n"

    assistant_message = save_assistant_message(
    db=db,
    chat_id=message_data.chat_id,
    content=full_response,
)

    create_or_update_summary(
        db=db,
        chat_id=message_data.chat_id,
    )

    return assistant_message

def stream_ai_response_after_edit(
    db: Session,
    message_id: int,
    current_user: User,
) -> Generator[str, None, None]:
    """
    Generate a new assistant response after
    an existing user message has been edited.

    Unlike stream_ai_response(), this does NOT
    create another user message.
    """

    message = (
        db.query(Message)
        .filter(
            Message.id == message_id,
            Message.role == MessageRole.USER,
        )
        .first()
    )

    if not message:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="User message not found",
        )

    chat=get_owned_chat(
        db=db,
        chat_id=message.chat_id,
        current_user=current_user,
    )

    context, sources = retrieve_context(
        query=message.content,
        user_id=current_user.id,
    )

    conversation = build_prompt(
    db=db,
    chat_id=message.chat_id,
    workspace_id=chat.workspace_id,
    user_query=message.content,
    rag_context=context,
)

    full_response = ""

    for chunk in agent.stream(
    conversation,
):
        full_response += chunk

        yield chunk

    if sources:
        source_text = (
            "\n\n---\n\nSources:\n"
        )

        for source in sources:
            source_text += (
                f"- {source}\n"
            )

        full_response += source_text

        # Stream citations too, otherwise they
        # only appear after the final DB refresh.
        yield source_text

    assistant_message = save_assistant_message(
    db=db,
    chat_id=message.chat_id,
    content=full_response,
)

    create_or_update_summary(
        db=db,
        chat_id=message.chat_id,
    )

    return assistant_message  