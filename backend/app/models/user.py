from sqlalchemy import Column, Integer, String

from app.database.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)
    workspaces = relationship(
    "Workspace",
    back_populates="user",
    cascade="all, delete-orphan",
)

    hashed_password = Column(String, nullable=False)
    chats = relationship(
    "Chat",
    back_populates="user",
    cascade="all, delete-orphan",
    
)