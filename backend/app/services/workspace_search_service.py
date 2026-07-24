from app.services.memory_retrieval_service import (
    retrieve_memories,
)
from app.services.summary_service import (
    get_summary,
)


def search_workspace(
    db,
    workspace_id: int,
    chat_id: int,
    query: str,
):
    """
    Search across the current workspace.

    Current sources:
    - Memories
    - Conversation Summary

    Future sources:
    - Chat Messages
    - Documents
    - Automations
    """

    results = []

    # -----------------------------
    # Semantic Memory Search
    # -----------------------------

    memories = retrieve_memories(
        db=db,
        workspace_id=workspace_id,
        query=query,
    )

    for memory in memories:
        results.append(
            {
                "type": "memory",
                "content": memory["content"],
                "memory_type": memory["memory_type"],
                "importance": memory["importance"],
            }
        )

    # -----------------------------
    # Conversation Summary
    # -----------------------------

    summary = get_summary(
        db=db,
        chat_id=chat_id,
    )

    if summary and summary.summary:
        results.append(
            {
                "type": "summary",
                "content": summary.summary,
            }
        )

    return {
        "results": results,
    }