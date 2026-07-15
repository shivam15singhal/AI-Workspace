from pathlib import Path

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.document import Document

from app.llm.service import LLMService
from app.vectorstore.chroma import collection

from pypdf import PdfReader
from docx import Document as DocxDocument

llm_service = LLMService()


def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def extract_docx_text(file_path: Path) -> str:
    document = DocxDocument(file_path)

    return "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )


def extract_txt_text(file_path: Path) -> str:
    return file_path.read_text(
        encoding="utf-8",
    )


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

        if document.content_type == "application/pdf":
            text = extract_pdf_text(file_path)

        elif (
            document.content_type
            == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ):
            text = extract_docx_text(file_path)

        else:
            text = extract_txt_text(file_path)

        chunks = chunk_text(text)

        for index, chunk in enumerate(chunks):
            embedding = llm_service.embedding(chunk)

            collection.add(
                ids=[
                    f"{document.id}_{index}"
                ],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[
                    {
                        "document_id": document.id,
                        "user_id": document.user_id,
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