class AutomationService:
    """
    Handles communication with external
    automation platforms such as n8n.
    """

    def trigger(
        self,
        workflow: str,
        payload: dict,
    ):
        raise NotImplementedError