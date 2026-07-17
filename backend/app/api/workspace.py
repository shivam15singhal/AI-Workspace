from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db

from app.models.user import User

from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse,
)

from app.services.workspace_service import (
    create_workspace,
    get_user_workspaces,
    get_workspace,
    update_workspace,
    delete_workspace,
)

router = APIRouter(
    prefix="/api/workspaces",
    tags=["Workspaces"],
)


@router.post(
    "",
    response_model=WorkspaceResponse,
)
def create_new_workspace(
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_workspace(
        db=db,
        current_user=current_user,
        name=workspace.name,
        description=workspace.description,
        color=workspace.color,
        icon=workspace.icon,
    )


@router.get(
    "",
    response_model=List[WorkspaceResponse],
)
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_workspaces(
        db=db,
        current_user=current_user,
    )


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
)
def get_single_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_workspace(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )


@router.patch(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
)
def edit_workspace(
    workspace_id: int,
    workspace_data: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = get_workspace(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )

    return update_workspace(
        db=db,
        workspace=workspace,
        name=workspace_data.name,
        description=workspace_data.description,
        color=workspace_data.color,
        icon=workspace_data.icon,
    )


@router.delete("/{workspace_id}")
def remove_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = get_workspace(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )

    return delete_workspace(
        db=db,
        workspace=workspace,
    )