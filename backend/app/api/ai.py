from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User

from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
)

from app.services.tool_router import choose_tool
from app.services.tool_executor import ToolExecutor

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)

@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print("AI CHAT ROUTE HIT")
    tool = choose_tool(
        request.message
    )

    if tool.get("tool") is None:

        return ChatResponse(
            role="assistant",
            message="I understood your message, but no tool was required."
        )

    executor = ToolExecutor(
        db,
        current_user,
    )

    result = executor.execute(
        tool["tool"],
        tool["arguments"],
    )

    return ChatResponse(
        role="assistant",
        message=str(result),
    )