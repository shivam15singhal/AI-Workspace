from sqlalchemy.orm import Session

from app.models.message import Message
from app.models.conversation_summary import (
    ConversationSummary,
)
from app.llm.service import LLMService

llm_service = LLMService()

SUMMARY_PROMPT = """
You are an AI conversation summarizer.

Summarize the conversation while preserving:

- important facts
- user goals
- decisions
- preferences
- ongoing tasks
- useful context

Keep the summary concise.

Return plain text only.
"""

def generate_summary(
    messages: list[Message],
):
    conversation = [
        {
            "role": "system",
            "content": SUMMARY_PROMPT,
        }
    ]

    for message in messages:
        conversation.append(
            {
                "role": message.role.value,
                "content": message.content,
            }
        )

    return llm_service.generate(
        conversation,
    )

def get_summary(
    db: Session,
    chat_id: int,
):
    return (
        db.query(ConversationSummary)
        .filter(
            ConversationSummary.chat_id
            == chat_id
        )
        .first()
    )

def create_or_update_summary(
    db: Session,
    chat_id: int,
):
    """
    Create a new summary or update
    the existing one.
    """

    messages = (
        db.query(Message)
        .filter(
            Message.chat_id == chat_id
        )
        .order_by(
            Message.created_at.asc()
        )
        .all()
    )

    if len(messages) < 20:
        return

    summary_text = generate_summary(
        messages,
    )

    summary = get_summary(
        db=db,
        chat_id=chat_id,
    )

    if summary is None:
        summary = ConversationSummary(
            chat_id=chat_id,
            summary=summary_text,
        )

        db.add(summary)

    else:
        summary.summary = summary_text

    db.commit()

    db.refresh(summary)

    return summary