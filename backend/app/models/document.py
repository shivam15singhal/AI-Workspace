from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    filename = Column(
        String,
        nullable=False,
    )

    filepath = Column(
        String,
        nullable=False,
    )

    content_type = Column(
        String,
        nullable=False,
    )

    size = Column(
        Integer,
        nullable=False,
    )
    status = Column(
        String,
        nullable=False,
        default="uploading",
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
    workspace_id = Column(
    Integer,
    ForeignKey(
        "workspaces.id",
        ondelete="CASCADE",
    ),
    nullable=False,
    )

    user = relationship(
    "User",
    )

    workspace = relationship(
    "Workspace",
    back_populates="documents",
    )