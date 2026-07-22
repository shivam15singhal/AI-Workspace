from app.llm.service import LLMService

from app.vectorstore.chroma import (
    memory_collection,
)

llm_service = LLMService()


def retrieve_memories(
    db,
    workspace_id: int,
    query: str,
    top_k: int = 5,
):
    """
    Retrieve semantically similar
    workspace memories.
    """

    embedding = llm_service.embedding(
        query,
    )

    results = memory_collection.query(
        query_embeddings=[
            embedding,
        ],
        n_results=top_k,
        where={
            "workspace_id": workspace_id,
        },
    )
    

    documents = results.get(
        "documents",
        [],
    )

    metadatas = results.get(
        "metadatas",
        [],
    )
    distances = results.get(
    "distances",
    [],
)

    if distances and distances[0]:
        distance = distances[0][0]

        if distance > 500:
            return []

    if (
        not documents
        or not documents[0]
    ):
        return []

    memories = []

    for content, metadata in zip(
        documents[0],
        metadatas[0],
    ):
        memories.append(
            {
                "content": content,
                "memory_type": metadata.get(
                    "memory_type",
                ),
                "importance": metadata.get(
                    "importance",
                    3,
                ),
            }
        )

    return memories