from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.workspace import Workspace


def create_workspace(
    db: Session,
    current_user: User,
    name: str,
    description: str | None,
    color: str,
    icon: str,
):
    workspace = Workspace(
       name=name,
    description=description,
    color=color,
    icon=icon,
    user_id=current_user.id,
    )

    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    return workspace


def get_user_workspaces(
    db: Session,
    current_user: User,
):
    return (
        db.query(Workspace)
        .filter(
            Workspace.user_id == current_user.id
        )
        .order_by(
            Workspace.created_at.desc()
        )
        .all()
    )


def get_workspace(
    db: Session,
    workspace_id: int,
    current_user: User,
):
    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.user_id == current_user.id,
        )
        .first()
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found",
        )

    return workspace


def update_workspace(
    db: Session,
    workspace: Workspace,
    name: str | None,
    description: str | None,
    color: str | None,
    icon: str | None,
):
    if name is not None:
        workspace.name = name

    if description is not None:
        workspace.description = description

    if color is not None:
     workspace.color = color

    if icon is not None:
        workspace.icon = icon

    db.commit()
    db.refresh(workspace)

    return workspace


def delete_workspace(
    db: Session,
    workspace: Workspace,
):
    db.delete(workspace)
    db.commit()

    return {
        "message": "Workspace deleted successfully"
    }