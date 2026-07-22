from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Text,
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class ConversationSummary(Base):
    __tablename__ = "conversation_summaries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    chat_id = Column(
        Integer,
        ForeignKey(
            "chats.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
    )

    summary = Column(
        Text,
        nullable=False,
        default="",
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    chat = relationship(
        "Chat",
        back_populates="summary",
    )