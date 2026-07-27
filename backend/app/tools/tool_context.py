from dataclasses import dataclass
from sqlalchemy.orm import Session

from app.models.user import User


@dataclass
class ToolContext:
    

    db: Session | None = None

    workspace_id: int | None = None

    chat_id: int | None = None

    user_id: int | None = None

    current_user: User | None = None