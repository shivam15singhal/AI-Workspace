from app.llm.service import LLMService
from app.vectorstore.chroma import (
    documents_collection,
)
from app.models.document import Document
from app.database.database import SessionLocal

llm_service = LLMService()


def retrieve_context(
    query: str,
    user_id: int,
    top_k: int = 5,
):
    embedding = llm_service.embedding(query)

    results = documents_collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={
            "user_id": user_id,
        },
    )
    

    documents = results.get("documents", [])
    distances = results.get("distances", [])
    if distances and distances[0]:
     distance = distances[0][0]
     if distance > 500:
         return "", []

    metadata = results.get("metadatas", [])

    if not documents or not documents[0]:
        return "", []

    db = SessionLocal()

    try:
        sources = []

        seen = set()

        for meta in metadata[0]:
            document = (
                db.query(Document)
                .filter(
                    Document.id == meta["document_id"]
                )
                .first()
            )

            if document and document.filename not in seen:
                seen.add(document.filename)
                sources.append(document.filename)

    finally:
        db.close()

    return "\n\n".join(documents[0]), sources

def rewrite_query(
    conversation: list[dict],
    question: str,
) -> str:
    """
    Rewrite follow-up questions into standalone questions.
    """

    prompt = [
        {
            "role": "system",
            "content": """
Rewrite the user's latest question into a standalone question.

Only return the rewritten question.

Do not answer it.
""",
        },
        *conversation[-6:],
        {
            "role": "user",
            "content": question,
        },
    ]

    return llm_service.generate(prompt)

def keyword_search(
    query: str,
    documents: list[str],
) -> list[str]:
    """
    Very simple keyword search.
    """

    query = query.lower()

    return [
        doc
        for doc in documents
        if query in doc.lower()
    ]