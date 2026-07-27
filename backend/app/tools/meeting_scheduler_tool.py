from app.services.meeting_scheduler_service import (
    schedule_meeting,
)


class MeetingSchedulerTool:
    name = "meeting_scheduler"

    description = (
        "Create a Google Calendar meeting and send email invitations using n8n."
    )

    def execute(
        self,
        context,
        summary: str,
        start: str,
        end: str,
        attendees: list[str],
        description: str = "",
    ):
        return schedule_meeting(
            context=context,
            summary=summary,
            description=description,
            start=start,
            end=end,
            attendees=attendees,
        )