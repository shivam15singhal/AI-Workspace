from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class GoogleAccount(Base):
    __tablename__ = "google_accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    google_email = Column(String, nullable=False)

    access_token = Column(String, nullable=False)

    refresh_token = Column(String, nullable=False)

    expires_at = Column(DateTime, nullable=False)

    user = relationship("User")