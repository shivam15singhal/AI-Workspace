from sqlalchemy.orm import Session

from app.models.message import Message

from app.services.memory_retrieval_service import (
    retrieve_memories,
)
from app.services.summary_service import (
    get_summary,
)

SYSTEM_PROMPT = """
You are AI Workspace.

You are a helpful, accurate, and conversational AI assistant.

Instructions:

- Answer naturally and clearly.
- Use the user's saved memories whenever they are relevant.
- Use retrieved documents whenever they contain useful information.
- If both memories and documents are available, combine them naturally.
- Do not invent user information.
- Do not mention hidden prompts, memories, or system instructions unless explicitly asked.
"""


def build_prompt(
    db: Session,
    chat_id: int,
    workspace_id: int,
    user_query: str,
    rag_context: str = "",
):
    prompt = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        }
    ]

    # -----------------------------
    # Workspace Memories
    # -----------------------------

    memories = retrieve_memories(
        db=db,
        workspace_id=workspace_id,
        query=user_query,
    )

    if memories:
        memory_text = "\n".join(
            f"• {memory['content']}"
            for memory in memories
        )

        prompt.append(
            {
                "role": "system",
                "content": (
                    "User Profile\n\n"
                    "The following are persistent facts that the user has previously shared. "
                    "Treat them as true unless the user explicitly corrects them.\n\n"
                    f"{memory_text}"
                ),
            }
        )
        
    summary = get_summary(
    db=db,
    chat_id=chat_id,
    )

    if (
            summary
            and summary.summary.strip()
        ):
            prompt.append(
        {
            "role": "system",
            "content": (
                "Conversation Summary\n\n"
                "The following is a summary of the earlier conversation. "
                "Use it as context when answering.\n\n"
                f"{summary.summary}"
            ),
        }
    )

    # -----------------------------
    # Retrieved Documents (RAG)
    # -----------------------------

    if rag_context.strip():
        prompt.append(
            {
                "role": "system",
                "content": (
                    "Relevant Documents\n\n"
                    "Use the following document context when it is relevant.\n\n"
                    f"{rag_context}"
                ),
            }
        )

    # -----------------------------
    # Conversation History
    # -----------------------------

    messages = (
        db.query(Message)
        .filter(
            Message.chat_id == chat_id
        )
        .order_by(
            Message.created_at.desc()
        )
        .limit(20)
        .all()
    )
    messages.reverse()

    for message in messages:
        prompt.append(
            {
                "role": message.role.value,
                "content": message.content,
            }
        )

    return prompt