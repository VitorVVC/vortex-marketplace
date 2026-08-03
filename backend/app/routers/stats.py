from fastapi import APIRouter
from sqlalchemy import func, select

from app.dependencies import DatabaseSession
from app.models.ad import Ad
from app.models.user import User
from app.schemas.stats import StatsResponse

router = APIRouter(
    prefix="/stats",
    tags=["Statistics"],
)


@router.get(
    "",
    response_model=StatsResponse,
    summary="Consultar estatísticas da plataforma",
)
def get_stats(
        db: DatabaseSession,
) -> StatsResponse:
    total_ads = db.scalar(
        select(func.count()).select_from(Ad)
    ) or 0

    total_users = db.scalar(
        select(func.count()).select_from(User)
    ) or 0

    total_donations = db.scalar(
        select(func.count())
        .select_from(Ad)
        .where(Ad.is_donation.is_(True))
    ) or 0

    return StatsResponse(
        total_ads=total_ads,
        total_users=total_users,
        total_donations=total_donations,
    )
