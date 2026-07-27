from app.database.database import SessionLocal
from app.llm.service import LLMService
from app.models.document import Document
from app.vectorstore.chroma import documents_collection

llm_service = LLMService()

# Adjust this based on your embedding model after testing.
MAX_DISTANCE = 500


def retrieve_context(
    query: str,
    user_id: int,
    workspace_id: int,
    top_k: int = 5,
):
    """
    Retrieve the most relevant document chunks for a user's query.
    """

    query = query.strip()

    embedding = llm_service.embedding(query)

    results = documents_collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
       where={
    "$and": [
        {"user_id": user_id},
        {"workspace_id": workspace_id},
    ]
},
    )

    documents = results.get("documents", [])
    distances = results.get("distances", [])
    metadata = results.get("metadatas", [])

    if not documents or not documents[0]:
        return "", []

    # Ignore obviously irrelevant matches.
    if distances and distances[0]:
        best_distance = distances[0][0]

        if best_distance > MAX_DISTANCE:
            return "", []

    db = SessionLocal()

    try:
        sources = []
        seen_sources = set()

        for meta in metadata[0]:
            document = (
                db.query(Document)
                .filter(Document.id == meta["document_id"])
                .first()
            )

            if (
                document
                and document.filename not in seen_sources
            ):
                seen_sources.add(document.filename)
                sources.append(document.filename)

    finally:
        db.close()

    # Remove duplicate chunks while preserving order.
    unique_chunks = list(dict.fromkeys(documents[0]))

    formatted_context = []

    for index, chunk in enumerate(unique_chunks, start=1):
        formatted_context.append(
            f"""Document Chunk {index}
----------------------------------------
{chunk}"""
        )

    return "\n\n".join(formatted_context), sources


def rewrite_query(
    conversation: list[dict],
    question: str,
) -> str:
    """
    Rewrite a follow-up question into a standalone question.
    """

    prompt = [
        {
            "role": "system",
            "content": (
                "Rewrite the user's latest question into a "
                "standalone question.\n\n"
                "Only return the rewritten question.\n"
                "Do not answer it."
            ),
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

    query = query.lower().strip()

    return [
        doc
        for doc in documents
        if query in doc.lower()
    ]