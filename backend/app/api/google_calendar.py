from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
import requests
from app.auth.dependencies import get_current_user
from app.auth.jwt_handler import create_oauth_state, verify_oauth_state
from app.database.database import get_db
from app.models.user import User
from app.schemas.google_calendar import (
    CreateEventRequest,
    UpdateEventRequest,
)
from app.services.google_calendar_service import (
    get_authorization_url,
    exchange_code_for_tokens,
    get_google_user_info,
    save_google_account,
    list_calendar_events,
     create_calendar_event,
     delete_calendar_event,
     update_calendar_event,
     get_google_connection_status,
     disconnect_google_account,
)

router = APIRouter(
    prefix="/api/google",
    tags=["Google Calendar"],
)

# Temporary in-memory store
oauth_sessions = {}


@router.get("/login")
def google_login(
    current_user: User = Depends(get_current_user),
):
    state = create_oauth_state(current_user.id)

    authorization_url, code_verifier = get_authorization_url(state)

    print("AUTH URL:", authorization_url)

    oauth_sessions[state] = code_verifier

    print("STATE:", state)
    print("VERIFIER:", code_verifier)

    return JSONResponse(
        {
            "authorization_url": authorization_url
        }
    )

@router.get("/status")
def google_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_google_connection_status(
        db=db,
        current_user=current_user,
    )

@router.delete("/disconnect")
def disconnect_google(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return disconnect_google_account(
        db=db,
        current_user=current_user,
    )

@router.get("/events")
def get_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    events = list_calendar_events(
        db=db,
        current_user=current_user,
    )

    return {
        "events": events
    }

@router.post("/events")
def create_event(
    request: CreateEventRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = create_calendar_event(
        db=db,
        current_user=current_user,
        summary=request.summary,
        description=request.description or "",
        start=request.start,
        end=request.end,
    )

    return {
        "message": "Event created successfully",
        "event": event,
    }

@router.delete("/events/{event_id}")
def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_calendar_event(
        db=db,
        current_user=current_user,
        event_id=event_id,
    )
@router.put("/events/{event_id}")
def update_event(
    event_id: str,
    request: UpdateEventRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = update_calendar_event(
        db=db,
        current_user=current_user,
        event_id=event_id,
        summary=request.summary,
        description=request.description or "",
        start=request.start,
        end=request.end,
    )

    return {
        "message": "Event updated successfully",
        "event": event,
    }

@router.get("/callback")
def google_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db),
):
    payload = verify_oauth_state(state)

    if payload is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid OAuth state",
        )

    code_verifier = oauth_sessions.pop(state, None)

    if code_verifier is None:
        raise HTTPException(
            status_code=400,
            detail="OAuth session expired",
        )

    user = (
        db.query(User)
        .filter(User.id == payload["user_id"])
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    credentials = exchange_code_for_tokens(
        code,
        code_verifier,
    )

    

    response = requests.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        headers={
            "Authorization": f"Bearer {credentials.token}"
        },
    )

    

    response.raise_for_status()

    # If Calendar API works, then test user info
    google_user = get_google_user_info(credentials)

    

    save_google_account(
        db=db,
        current_user=user,
        credentials=credentials,
        google_email=google_user["email"],
    )

    return RedirectResponse(
        url="http://localhost:5173/settings?google=connected"
    )