from app.services.automation_service import trigger_workflow


class AutomationTool:
    name = "automation"

    description = (
        "Trigger an automation workflow in n8n.\n"
        "Arguments:\n"
        "- workflow (string): Name of the n8n workflow to execute.\n"
        "- payload (object): Data to send to the workflow."
    )

    def execute(
        self,
        context=None,
        workflow: str = "",
        payload: dict = None,
    ):
        """
        Trigger an n8n workflow.

        Args:
            context: Execution context (passed by the Tool Executor, not used here).
            workflow: Name of the workflow to trigger.
            payload: JSON payload for the workflow.

        Returns:
            Response from the automation service.
        """
        return trigger_workflow(
            workflow=workflow,
            payload=payload or {},
        )