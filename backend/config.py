import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Campus AI Sprint Growth Engine"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./campus_growth.db")
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "nxtwave_growth_2026_secure")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "")
    CAMPAIGN_TARGET: int = int(os.getenv("CAMPAIGN_TARGET", "500"))
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()
