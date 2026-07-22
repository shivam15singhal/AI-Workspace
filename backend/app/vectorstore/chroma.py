import chromadb

client = chromadb.PersistentClient(
    path="chroma_db",
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