from pathlib import Path

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.document import Document

from app.llm.service import LLMService
from app.services.file_parser import FileParser
from app.vectorstore.chroma import documents_collection

llm_service = LLMService()


def chunk_text(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 200,
):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunks.append(text[start:end])

        start += chunk_size - overlap

    return chunks


def process_document(
    document_id: int,
):
    db: Session = SessionLocal()
    document = None

    try:
        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            return

        document.status = "processing"
        db.commit()

        file_path = Path(document.filepath)

        # Extract text using the unified FileParser
        text = FileParser.extract_text(file_path)

        chunks = chunk_text(text)

        for index, chunk in enumerate(chunks):
            embedding = llm_service.embedding(chunk)

            documents_collection.add(
                ids=[f"{document.id}_{index}"],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[
                    {
                        "document_id": document.id,
                        "user_id": document.user_id,
                        "workspace_id": document.workspace_id,
                        "chunk_index": index,
                    }
                ],
            )

        document.status = "ready"
        db.commit()

    except Exception:
        if document:
            document.status = "failed"
            db.commit()
        raise

    finally:
        db.close()