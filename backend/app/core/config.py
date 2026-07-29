from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    FRONTEND_URL: str
    OLLAMA_EMBEDDING_MODEL: str = "bge-m3"
    N8N_BASE_URL: str
    UPLOAD_DIR: str = "uploads"
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:5173"]
    )

    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # Gemini
    LLM_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-flash-latest"
    OLLAMA_MODEL: str = "llama3.2"
    GEMINI_EMBEDDING_MODEL: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
    )


settings = Settings()