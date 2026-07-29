import chromadb

from app.core.config import settings

client = chromadb.PersistentClient(
    path=settings.CHROMA_DB_PATH,
)
documents_collection = (
    client.get_or_create_collection(
        name="documents",
    )
)

memory_collection = (
    client.get_or_create_collection(
        name="workspace_memories",
    )
)