from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.paths import DATABASE_FILE


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return f"sqlite:///{DATABASE_FILE.as_posix()}"


settings = Settings()
