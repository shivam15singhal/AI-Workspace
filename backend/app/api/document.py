from typing import List

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.document import DocumentResponse

from app.services.document_service import (
    save_document,
    get_user_documents,
    delete_document,
)

from app.services.document_processor import (
    process_document,
)

router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentResponse,
)
def upload_document(
    background_tasks: BackgroundTasks,
    workspace_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = save_document(
        db=db,
        file=file,
        current_user=current_user,
        workspace_id=workspace_id,
    )

    background_tasks.add_task(
        process_document,
        document.id,
    )

    return document


@router.get(
    "",
    response_model=List[DocumentResponse],
)
def list_documents(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_documents(
        db=db,
        current_user=current_user,
        workspace_id=workspace_id,

    )


@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_document(
        db=db,
        document_id=document_id,
        current_user=current_user,
    )