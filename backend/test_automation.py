from app.services.automation_service import trigger_workflow

print(
    trigger_workflow(
        workflow="ai-workspace",
        payload={
            "message": "Hello"
        },
    )
)