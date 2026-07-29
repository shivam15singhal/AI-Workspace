import requests
from app.core.config import settings
BASE_URL = settings.N8N_BASE_URL


def trigger_workflow(
    workflow: str,
    payload: dict,
):
    """
    Trigger an n8n workflow.
    """

    url = f"{BASE_URL}/{workflow}"

    try:
        response = requests.post(
            url,
            json=payload,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()

    except Exception as e:
        return {
            "error": str(e),
        }