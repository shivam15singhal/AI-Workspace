from sqlalchemy.orm import Session

from app.models.workspace_memory import WorkspaceMemory
from app.models.user import User

from app.schemas.workspace_memory import (
    WorkspaceMemoryCreate,
)

from app.services.workspace_service import (
    get_workspace,
)

from app.llm.service import LLMService

from app.vectorstore.chroma import (
    memory_collection,
)

llm_service = LLMService()


def create_memory(
    db: Session,
    workspace_id: int,
    memory_data: WorkspaceMemoryCreate,
    current_user: User,
):
    workspace = get_workspace(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )

    memory = WorkspaceMemory(
        workspace_id=workspace.id,
        content=memory_data.content,
        memory_type=memory_data.memory_type,
        importance=memory_data.importance,
    )

    db.add(memory)

    db.commit()

    db.refresh(memory)

    # Store embedding in Chroma
    embedding = llm_service.embedding(
        memory.content,
    )

    memory_collection.add(
        ids=[
            str(memory.id),
        ],
        embeddings=[
            embedding,
        ],
        documents=[
            memory.content,
        ],
        metadatas=[
            {
                "workspace_id": workspace.id,
                "memory_type": memory.memory_type,
                "importance": memory.importance,
            }
        ],
    )

    return memory


def get_memories(
    db: Session,
    workspace_id: int,
    current_user: User,
):
    workspace = get_workspace(
        db=db,
        workspace_id=workspace_id,
        current_user=current_user,
    )

    return (
        db.query(WorkspaceMemory)
        .filter(
            WorkspaceMemory.workspace_id
            == workspace.id
        )
        .order_by(
            WorkspaceMemory.importance.desc(),
            WorkspaceMemory.created_at.desc(),
        )
        .all()
    )


def delete_memory(
    db: Session,
    memory_id: int,
    current_user: User,
):
    memory = (
        db.query(WorkspaceMemory)
        .join(
            WorkspaceMemory.workspace,
        )
        .filter(
            WorkspaceMemory.id == memory_id,
            WorkspaceMemory.workspace.has(
                user_id=current_user.id,
            ),
        )
        .first()
    )

    if memory is None:
        return

    # Remove from Chroma
    memory_collection.delete(
        ids=[
            str(memory.id),
        ],
    )

    db.delete(memory)

    db.commit()


def create_memory_from_ai(
    db: Session,
    workspace_id: int,
    memory: dict,
):
    workspace_memory = WorkspaceMemory(
        workspace_id=workspace_id,
        content=memory["content"],
        memory_type=memory.get(
            "memory_type",
            "fact",
        ),
        importance=memory.get(
            "importance",
            3,
        ),
    )

    db.add(workspace_memory)

    db.commit()

    db.refresh(workspace_memory)

    # Generate embedding
    embedding = llm_service.embedding(
        workspace_memory.content,
    )

    # Store in Chroma
    memory_collection.add(
        ids=[
            str(workspace_memory.id),
        ],
        embeddings=[
            embedding,
        ],
        documents=[
            workspace_memory.content,
        ],
        metadatas=[
            {
                "workspace_id": workspace_id,
                "memory_type": workspace_memory.memory_type,
                "importance": workspace_memory.importance,
            }
        ],
    )
    

    return workspace_memory