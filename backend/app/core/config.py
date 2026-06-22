from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = ""
    supabase_url: str = ""
    supabase_key: str = ""
    gemini_api_key: str = ""
    secret_key: str = "change-me-in-production"
    environment: str = "development"
    debug: bool = True


settings = Settings()
