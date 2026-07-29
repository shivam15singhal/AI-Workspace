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

        
        text = FileParser.extract_text(file_path)

        chunks = chunk_text(text)
        

        for index, chunk in enumerate(chunks):
            embedding = llm_service.embedding(chunk)

            metadata = {
                "document_id": int(document.id),
                "user_id": int(document.user_id),
                "workspace_id": int(document.workspace_id),
                "filename": str(document.filename),
                "document_type": (
                    "workspace"
                    if document.chat_id is None
                    else "chat"
                ),
                "chunk_index": int(index),
            }

            
            if document.chat_id is not None:
                metadata["chat_id"] = int(document.chat_id)
                

            documents_collection.add(
                ids=[f"{document.id}_{index}"],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[metadata],
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