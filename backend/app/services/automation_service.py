import requests

BASE_URL = "http://localhost:5678/webhook-test"


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