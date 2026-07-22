from datetime import datetime

from app.tools.base import BaseTool


class DateTimeTool(BaseTool):

    name = "datetime"

    description = (
        "Returns the current date and time."
    )

    def execute(
        self,
        **kwargs,
    ):
        return {
            "current_time": str(
                datetime.now()
            )
        }