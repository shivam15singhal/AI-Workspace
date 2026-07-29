from app.tools.base import BaseTool
from app.tools.tool_context import ToolContext
from app.services.calendar_search import CalendarSearch
from app.services.google_calendar_service import (
    create_calendar_event,
    list_calendar_events,
    update_calendar_event,
    delete_calendar_event,
)


class CalendarCreateTool(BaseTool):

    name = "calendar.create"

    description = (
        "Creates a Google Calendar event."
    )

    def execute(
        self,
        context: ToolContext,
        summary: str,
        start: str,
        end: str,
        description: str = "",
        **kwargs,
    ):
        return create_calendar_event(
            db=context.db,
            current_user=context.current_user,
            summary=summary,
            description=description,
            start=start,
            end=end,
        )


class CalendarListTool(BaseTool):

    name = "calendar.list"

    description = (
        "Lists upcoming Google Calendar events."
    )

    def execute(
        self,
        context: ToolContext,
        **kwargs,
    ):
        return list_calendar_events(
            db=context.db,
            current_user=context.current_user,
        )


class CalendarDeleteTool(BaseTool):

    name = "calendar.delete"

    description = "Deletes a Google Calendar event."

    def execute(
        self,
        context: ToolContext,
        query: str,
        **kwargs,
    ):

        search = CalendarSearch(
            context.db,
            context.current_user,
        )

        event = search.find_event(query)

        if event is None:
            return {
                "success": False,
                "message": "Event not found."
            }

        return delete_calendar_event(
            db=context.db,
            current_user=context.current_user,
            event_id=event["id"],
        )

class CalendarUpdateTool(BaseTool):

    name = "calendar.update"

    description = (
        "Updates a Google Calendar event."
    )

    def execute(
        self,
        context: ToolContext,
        query: str,
        summary: str,
        start: str,
        end: str,
        description: str = "",
        **kwargs,
    ):
        search = CalendarSearch(
            context.db,
            context.current_user,
        )

        event = search.find_event(query)

        if event is None:
            return {
                "success": False,
                "message": "Event not found."
            }

        return update_calendar_event(
            db=context.db,
            current_user=context.current_user,
            event_id=event["id"],
            summary=summary,
            description=description,
            start=start,
            end=end,
        )