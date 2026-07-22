from datetime import datetime

from pydantic import BaseModel


class WorkspaceMemoryCreate(BaseModel):
    content: str
    memory_type: str = "fact"
    importance: int = 3


class WorkspaceMemoryUpdate(BaseModel):
    content: str


class WorkspaceMemoryResponse(BaseModel):
    id: int
    workspace_id: int

    content: str

    memory_type: str

    importance: int

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True