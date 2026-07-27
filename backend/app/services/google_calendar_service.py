from datetime import datetime, timedelta, timezone

from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from sqlalchemy.orm import Session
import requests

from app.core.config import settings
from app.models.google_account import GoogleAccount
from app.models.user import User

from googleapiclient.discovery import build
from fastapi import HTTPException

SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar",
]


def create_flow():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [
                    settings.GOOGLE_REDIRECT_URI,
                ],
            }
        },
        scopes=SCOPES,
    )

    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
    return flow


def get_authorization_url(state: str):
    flow = create_flow()

    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        state=state,
    )

    return authorization_url, flow.code_verifier


def exchange_code_for_tokens(code: str, code_verifier: str):
    response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
            "code_verifier": code_verifier,
        },
    )

    print("\n================ TOKEN RESPONSE ================")
    print("STATUS:", response.status_code)
    print(response.text)
    print("===============================================\n")

    response.raise_for_status()

    token_data = response.json()

    print("\n================ TOKEN DATA ====================")
    print(token_data)
    print("===============================================\n")

    credentials = Credentials(
        token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=token_data.get("scope", "").split(),
    )

    # Set expiry manually (IMPORTANT)
    credentials.expiry = datetime.now(timezone.utc) + timedelta(
        seconds=token_data["expires_in"]
    )

    return credentials


def get_google_user_info(credentials):
    print("\n================ USER INFO DEBUG ===============")
    print("TOKEN USED:")
    print(credentials.token)
    print("===============================================\n")

    response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": f"Bearer {credentials.token}"
        },
    )

    print("\n================ USER INFO RESPONSE ============")
    print("STATUS:", response.status_code)
    print(response.text)
    print("===============================================\n")

    response.raise_for_status()

    return response.json()


def save_google_account(
    db: Session,
    current_user: User,
    credentials: Credentials,
    google_email: str,
):
    account = (
        db.query(GoogleAccount)
        .filter(GoogleAccount.user_id == current_user.id)
        .first()
    )

    if account:
        account.google_email = google_email
        account.access_token = credentials.token

        if credentials.refresh_token:
            account.refresh_token = credentials.refresh_token

        account.expires_at = credentials.expiry

    else:
        account = GoogleAccount(
            user_id=current_user.id,
            google_email=google_email,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token,
            expires_at=credentials.expiry,
        )

        db.add(account)

    db.commit()
    db.refresh(account)

    return account

def get_google_credentials(
    db: Session,
    current_user: User,
):
    account = (
        db.query(GoogleAccount)
        .filter(GoogleAccount.user_id == current_user.id)
        .first()
    )

    if account is None:
        raise HTTPException(
            status_code=404,
            detail="Google account not connected.",
        )

    credentials = Credentials(
        token=account.access_token,
        refresh_token=account.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )

    credentials.expiry = account.expires_at

    return credentials


def list_calendar_events(
    db: Session,
    current_user: User,
):
    credentials = get_google_credentials(
        db,
        current_user,
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    now = datetime.now(timezone.utc).isoformat()

    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )

    events = events_result.get("items", [])

    formatted_events = []

    for event in events:
        formatted_events.append({
            "id": event.get("id"),
        "summary": event.get("summary", "No Title"),
        "description": event.get("description", ""),
        "start": event["start"].get("dateTime", event["start"].get("date")),
        "end": event["end"].get("dateTime", event["end"].get("date")),
    })

    return {
    "result": formatted_events
}

def create_calendar_event(
    db: Session,
    current_user: User,
    summary: str,
    description: str,
    start: str,
    end: str,
):
    credentials = get_google_credentials(
        db,
        current_user,
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    event = {
        "summary": summary,
        "description": description,
        "start": {
            "dateTime": start,
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end,
            "timeZone": "Asia/Kolkata",
        },
    }

    created_event = (
        service.events()
        .insert(
            calendarId="primary",
            body=event,
        )
        .execute()
    )

    return created_event

def delete_calendar_event(
    db: Session,
    current_user: User,
    summary: str,
):
    credentials = get_google_credentials(
        db,
        current_user,
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    time_min = (
    datetime.now(timezone.utc) - timedelta(days=30)
).isoformat()

    events = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=time_min,
            maxResults=100,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
        .get("items", [])
    )

    target_event = None

    for event in events:
        event_summary = event.get("summary", "").strip().lower()
        target_summary = summary.strip().lower()

        if (
        target_summary in event_summary
        or event_summary in target_summary
        ):
            target_event = event
            break

    if target_event is None:
        raise HTTPException(
            status_code=404,
            detail=f"Event '{summary}' not found.",
        )

    service.events().delete(
        calendarId="primary",
        eventId=target_event["id"],
    ).execute()

    return {
        "result": f"Deleted '{summary}' successfully."
    }
    

def update_calendar_event(
    db: Session,
    current_user: User,
    summary: str,
    description: str,
    start: str,
    end: str,
):
    credentials = get_google_credentials(
        db,
        current_user,
    )

    service = build(
        "calendar",
        "v3",
        credentials=credentials,
    )

    time_min = (
    datetime.now(timezone.utc) - timedelta(days=30)
).isoformat()

    events = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=time_min,
            maxResults=100,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
        .get("items", [])
    )
    print("\n========== EVENTS ==========")

    for event in events:
        print(
        event.get("summary"),
        event.get("id"),
        event["start"].get("dateTime", event["start"].get("date")),
    )

    print("============================\n")

    target_event = None

    for event in events:
        event_summary = event.get("summary", "").strip().lower()
        target_summary = summary.strip().lower()

        if (
            target_summary in event_summary
            or event_summary in target_summary
        ):
            target_event = event
            break

    if target_event is None:
        raise HTTPException(
            status_code=404,
            detail=f"Event '{summary}' not found.",
        )

    target_event["summary"] = summary
    target_event["description"] = description
    target_event["start"] = {
        "dateTime": start,
        "timeZone": "Asia/Kolkata",
    }
    target_event["end"] = {
        "dateTime": end,
        "timeZone": "Asia/Kolkata",
    }

    updated_event = service.events().update(
        calendarId="primary",
        eventId=target_event["id"],
        body=target_event,
    ).execute()

    return {
        "result": f"Updated '{summary}' successfully.",
        "event": updated_event,
    }

def get_google_connection_status(
    db: Session,
    current_user: User,
):
    account = (
        db.query(GoogleAccount)
        .filter(GoogleAccount.user_id == current_user.id)
        .first()
    )

    if account is None:
        return {
            "connected": False,
        }

    return {
        "connected": True,
        "email": account.google_email,
    }

def disconnect_google_account(
    db: Session,
    current_user: User,
):
    account = (
        db.query(GoogleAccount)
        .filter(GoogleAccount.user_id == current_user.id)
        .first()
    )

    if account is None:
        return {
            "message": "Google account already disconnected."
        }

    db.delete(account)
    db.commit()

    return {
        "message": "Google account disconnected successfully."
    }