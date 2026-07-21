from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import StreamingResponse

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse,MessageUpdate
from app.services.message_service import create_message, get_chat_messages,stream_ai_response,edit_user_message,stream_ai_response_after_edit

from app.services.message_service import stream_ai_response

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

@router.get("/{chat_id}", response_model=List[MessageResponse])
def get_messages(

    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_chat_messages(
        db=db,
        chat_id=chat_id,
        current_user=current_user,
    )

@router.post("/stream")
def stream_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StreamingResponse(
        stream_ai_response(
            db=db,
            message_data=message_data,
            current_user=current_user,
        ),
        media_type="text/plain",
    )

@router.patch(
    "/{message_id}",
    response_model=MessageResponse,
)
def update_message(
    message_id: int,
    message_data: MessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return edit_user_message(
        db=db,
        message_id=message_id,
        content=message_data.content,
        current_user=current_user,
    )


@router.post(
    "/{message_id}/regenerate"
)
def regenerate_after_edit(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return StreamingResponse(
        stream_ai_response_after_edit(
            db=db,
            message_id=message_id,
            current_user=current_user,
        ),
        media_type="text/plain",
    )