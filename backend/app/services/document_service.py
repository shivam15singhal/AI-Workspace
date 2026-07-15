from pathlib import Path
import shutil
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.user import User

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def save_document(
    db: Session,
    file: UploadFile,
    current_user: User,
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type",
        )

    user_dir = UPLOAD_DIR / f"user_{current_user.id}"
    user_dir.mkdir(exist_ok=True)

    extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = user_dir / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=file.filename,
        filepath=str(file_path),
        content_type=file.content_type,
        size=file.size,
        status="uploading",
        user_id=current_user.id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_user_documents(
    db: Session,
    current_user: User,
):
    return (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.id.desc())
        .all()
    )


def delete_document(
    db: Session,
    document_id: int,
    current_user: User,
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    file_path = Path(document.filepath)

    if file_path.exists():
        file_path.unlink()

    from app.vectorstore.chroma import collection

    collection.delete(
        where={
            "document_id": document.id,
        }
    )

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }