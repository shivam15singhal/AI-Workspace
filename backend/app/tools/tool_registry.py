from app.tools.calculator import CalculatorTool
from app.tools.datetime_tool import DateTimeTool
from app.tools.web_search_tool import WebSearchTool
from app.tools.python_interpreter import PythonInterpreterTool
from app.tools.automation_tool import AutomationTool
from app.tools.meeting_scheduler_tool import (
    MeetingSchedulerTool,
)

from app.tools.google_calendar import (
    CalendarCreateTool,
    CalendarListTool,
    CalendarUpdateTool,
    CalendarDeleteTool,
)

TOOLS = {
    "calculator": CalculatorTool(),
    "datetime": DateTimeTool(),
    "web_search": WebSearchTool(),
    "python": PythonInterpreterTool(),
    "automation": AutomationTool(),
    "meeting_scheduler": MeetingSchedulerTool(),

    "calendar.create": CalendarCreateTool(),
    "calendar.list": CalendarListTool(),
    "calendar.update": CalendarUpdateTool(),
    "calendar.delete": CalendarDeleteTool(),
}


def get_tool_descriptions():
    descriptions = []

    for tool in TOOLS.values():
        descriptions.append(
            f"{tool.name}\n"
            f"- {tool.description}"
        )

    return "\n\n".join(descriptions)