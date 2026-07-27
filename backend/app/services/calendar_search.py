from difflib import SequenceMatcher

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.google_calendar_service import (
    list_calendar_events,
)


class CalendarSearch:

    def __init__(
        self,
        db: Session,
        current_user: User,
    ):
        self.db = db
        self.current_user = current_user

    def find_event(
        self,
        query: str,
    ):

        events = list_calendar_events(
            self.db,
            self.current_user,
        )

        if not events:
            return None

        best_event = None
        best_score = 0

        query = query.lower()

        for event in events:

            summary = (
                event.get("summary", "")
                .lower()
            )

            score = SequenceMatcher(
                None,
                query,
                summary,
            ).ratio()

            if score > best_score:
                best_score = score
                best_event = event

        if best_score < 0.35:
            return None

        return best_event