from app.services.workspace_search_service import (
    search_workspace,
)


class WorkspaceSearchTool:
    name = "workspace_search"

    description = (
        "Search the current workspace for relevant memories, "
        "conversation summaries, and later documents and chats.\n"
        "Arguments:\n"
        "- db (database session)\n"
        "- workspace_id (integer)\n"
        "- chat_id (integer)\n"
        "- query (string)"
    )

    def execute(
        self,
        db,
        workspace_id: int,
        chat_id: int,
        query: str,
    ):
        return search_workspace(
            db=db,
            workspace_id=workspace_id,
            chat_id=chat_id,
            query=query,
        )