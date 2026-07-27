from app.models.user import User
from sqlalchemy.orm import Session

from app.services.google_calendar_service import (
    list_calendar_events,
    create_calendar_event,
    update_calendar_event,
    delete_calendar_event,
)

from app.services.calendar_search import CalendarSearch


class ToolExecutor:

    def __init__(
        self,
        db: Session,
        current_user: User,
    ):
        self.db = db
        self.current_user = current_user

    def execute(
        self,
        tool: str,
        arguments: dict,
    ):

        if tool == "calendar.list":
            return list_calendar_events(
                self.db,
                self.current_user,
            )

        elif tool == "calendar.create":
            return create_calendar_event(
                self.db,
                self.current_user,
                summary=arguments["summary"],
                description=arguments.get("description", ""),
                start=arguments["start"],
                end=arguments["end"],
            )

        elif tool == "calendar.delete":

            search = CalendarSearch(
            self.db,
            self.current_user,
        )

            event = search.find_event(
             arguments["query"]
            )

            if event is None:
                return {
                "success": False,
                "message": "Event not found."
            }

            delete_calendar_event(
            self.db,
            self.current_user,
            event["id"],
        )

            return {
            "success": True,
            "message": f'Deleted "{event["summary"]}"'
        }

        elif tool == "calendar.update":

            search = CalendarSearch(
            self.db,
            self.current_user,
        )

            event = search.find_event(
            arguments["query"]
        )

            if event is None:
                return {
                "success": False,
                "message": "Event not found."
            }

            return update_calendar_event(
            self.db,
            self.current_user,
            event["id"],
            summary=arguments["summary"],
            description=arguments.get("description", ""),
            start=arguments["start"],
            end=arguments["end"],
        )

        else:
            raise ValueError(
            f"Unsupported tool: {tool}"
        )