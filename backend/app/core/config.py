from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NdaCampaignDemo"

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "NdaCampaignDemo"
    POSTGRES_PORT: str = "5432"

    class Config:
        case_sensitive = True

settings = Settings()
