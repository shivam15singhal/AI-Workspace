from app.database.database import SessionLocal
from app.models.user import User

from app.services.tool_executor import ToolExecutor

db = SessionLocal()

user = (
    db.query(User)
    .filter(User.email == "shivam@gmail.com")
    .first()
)

executor = ToolExecutor(
    db,
    user,
)

result = executor.execute(
    "calendar.delete",
    {
        "query": "AI Interview"
    }
)

print(result)