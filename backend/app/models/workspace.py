from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    description = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="workspaces",
    )

    chats = relationship(
    "Chat",
    back_populates="workspace",
    cascade="all, delete-orphan",
    )

    documents = relationship(
    "Document",
    back_populates="workspace",
    cascade="all, delete-orphan",
    )

    color = Column(
    String,
    default="#6366F1",
    nullable=False,
    )

    icon = Column(
    String,
    default="folder",
    nullable=False,
    )

    memories = relationship(
    "WorkspaceMemory",
    back_populates="workspace",
    cascade="all, delete-orphan",
   )