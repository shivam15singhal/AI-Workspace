from fastapi import FastAPI

app = FastAPI(
    title="AI Workspace API",
    description="Backend API for AI Workspace",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Workspace 🚀"
    }