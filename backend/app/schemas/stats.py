from pydantic import BaseModel


class StatsResponse(BaseModel):
    total_ads: int
    total_users: int
    total_donations: int
