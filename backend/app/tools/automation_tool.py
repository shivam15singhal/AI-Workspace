from app.services.automation_service import (
    trigger_workflow,
)


class AutomationTool:
    name = "automation"

    description = (
        "Trigger an automation workflow in n8n.\n"
        "Arguments:\n"
        "- workflow (string)\n"
        "- payload (object)"
    )

    def execute(
        self,
        workflow: str,
        payload: dict,
    ):
        return trigger_workflow(
            workflow=workflow,
            payload=payload,
        )