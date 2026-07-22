from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class WorkspaceMemory(Base):
    __tablename__ = "workspace_memories"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    workspace_id = Column(
        Integer,
        ForeignKey(
            "workspaces.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    memory_type = Column(
        String,
        default="fact",
        nullable=False,
    )

    importance = Column(
        Integer,
        default=3,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    workspace = relationship(
        "Workspace",
        back_populates="memories",
    )