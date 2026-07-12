from app.llm.service import LLMService
from app.vectorstore.chroma import collection

llm_service = LLMService()


def retrieve_context(
    query: str,
    user_id: int,
    top_k: int = 5,
) -> str:
    embedding = llm_service.embedding(query)

    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={
            "user_id": user_id,
        },
    )

    documents = results.get("documents", [])

    if not documents or not documents[0]:
        return ""

    return "\n\n".join(documents[0])