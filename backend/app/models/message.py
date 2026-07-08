from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database.database import Base
from app.enums.message_role import MessageRole


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    chat_id = Column(
        Integer,
        ForeignKey("chats.id", ondelete="CASCADE"),
        nullable=False,
    )

    role = Column(
        Enum(MessageRole),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    chat = relationship(
        "Chat",
        back_populates="messages",
    )