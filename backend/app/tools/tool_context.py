from dataclasses import dataclass

from sqlalchemy.orm import Session


@dataclass
class ToolContext:
    """
    Runtime context available to tools.

    This information is provided by the backend,
    not by the language model.
    """

    db: Session | None = None

    workspace_id: int | None = None

    chat_id: int | None = None

    user_id: int | None = None