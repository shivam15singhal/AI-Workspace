from app.database.database import SessionLocal

from app.tools.workspace_search_tool import (
    WorkspaceSearchTool,
)

tool = WorkspaceSearchTool()

db = SessionLocal()

result = tool.execute(
    db=db,
    workspace_id=4,   # Use one of your existing workspace IDs
    chat_id=31,       # Use an existing chat that has a summary
    query="Python",
)

print("=" * 60)
print(result)
print("=" * 60)

db.close()