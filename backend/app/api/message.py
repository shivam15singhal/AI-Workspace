from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse
from app.services.message_service import create_message

router = APIRouter(
    prefix="/api/messages",
    tags=["Messages"],
)


@router.post("", response_model=MessageResponse)
def create_new_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_message(
        db=db,
        message_data=message_data,
        current_user=current_user,
    )