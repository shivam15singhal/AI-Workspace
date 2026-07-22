from typing import List

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db

from app.models.user import User

from app.schemas.workspace_memory import (
    WorkspaceMemoryCreate,
    WorkspaceMemoryResponse,
)

from app.services.workspace_memory_service import (
    create_memory,
    delete_memory,
    get_memories,
)

router = APIRouter(
    prefix="/api/workspace-memories",
    tags=["Workspace Memories"],
)


@router.post(
    "/{workspace_id}",
    response_model=WorkspaceMemoryResponse,
)
def create_workspace_memory(
    workspace_id: int,
    memory_data: WorkspaceMemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    return create_memory(
        db=db,
        workspace_id=workspace_id,
        memory_data=memory_data,
        current_user=current_user,
    )


@router.get(
    "/{workspace_id}",
    response_model=List[
        WorkspaceMemoryResponse
    ],
)
def get_workspace_memories(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    return get_memories(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )


@router.delete("/{memory_id}")
def delete_workspace_memory(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    delete_memory(
        db=db,
        memory_id=memory_id,
        current_user=current_user,
    )

    return {
        "message": "Memory deleted successfully."
    }