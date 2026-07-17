from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = "#6366F1"
    icon: Optional[str] = "folder"


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class WorkspaceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    color: str
    icon: str
    created_at: datetime

    class Config:
        from_attributes = True