from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import joinedload

from app.dependencies import CurrentUser, DatabaseSession
from app.models.ad import Ad
from app.schemas.ad import (
    AdCreate,
    AdListResponse,
    AdResponse, AdUpdate,
)

router = APIRouter(
    prefix="/ads",
    tags=["Advertisements"],
)


@router.post(
    "",
    response_model=AdResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar anúncio",
)
def create_ad(
        ad_data: AdCreate,
        db: DatabaseSession,
        current_user: CurrentUser,
) -> Ad:
    ad = Ad(
        title=ad_data.title.strip(),
        description=ad_data.description.strip(),
        category=ad_data.category.strip(),
        price=ad_data.price,
        is_donation=ad_data.is_donation,
        image_url=str(ad_data.image_url) if ad_data.image_url else None,
        owner_id=current_user.id,
    )

    db.add(ad)
    db.commit()
    db.refresh(ad)

    return ad


@router.get(
    "",
    response_model=AdListResponse,
    summary="Listar anúncios",
)
def list_ads(
        db: DatabaseSession,
        category: Annotated[
            str | None,
            Query(
                min_length=2,
                max_length=50,
                description="Filtrar anúncios por categoria.",
            ),
        ] = None,
        search: Annotated[
            str | None,
            Query(
                min_length=2,
                max_length=100,
                description="Pesquisar no título ou descrição.",
            ),
        ] = None,
        page: Annotated[
            int,
            Query(ge=1),
        ] = 1,
        page_size: Annotated[
            int,
            Query(ge=1, le=50),
        ] = 12,
) -> AdListResponse:
    filters = []

    if category:
        filters.append(
            func.lower(Ad.category) == category.lower()
        )

    if search:
        search_term = f"%{search.strip().lower()}%"

        filters.append(
            or_(
                func.lower(Ad.title).like(search_term),
                func.lower(Ad.description).like(search_term),
            )
        )

    query = (
        select(Ad)
        .options(joinedload(Ad.owner))
        .where(*filters)
        .order_by(Ad.created_at.desc())
    )

    count_query = (
        select(func.count())
        .select_from(Ad)
        .where(*filters)
    )

    total = db.scalar(count_query) or 0

    ads = db.scalars(
        query
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return AdListResponse(
        items=[
            AdResponse.model_validate(ad)
            for ad in ads
        ],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/me",
    response_model=list[AdResponse],
    summary="Listar meus anúncios",
)
def list_my_ads(
        db: DatabaseSession,
        current_user: CurrentUser,
) -> list[Ad]:
    query = (
        select(Ad)
        .options(joinedload(Ad.owner))
        .where(Ad.owner_id == current_user.id)
        .order_by(Ad.created_at.desc())
    )

    return list(db.scalars(query).all())


@router.get(
    "/{ad_id}",
    response_model=AdResponse,
    summary="Consultar anúncio",
)
def get_ad(
        ad_id: int,
        db: DatabaseSession,
) -> Ad:
    ad = db.scalar(
        select(Ad)
        .options(joinedload(Ad.owner))
        .where(Ad.id == ad_id)
    )

    if ad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado.",
        )

    return ad


@router.patch(
    "/{ad_id}",
    response_model=AdResponse,
    summary="Atualizar anúncio",
)
def update_ad(
        ad_id: int,
        ad_data: AdUpdate,
        db: DatabaseSession,
        current_user: CurrentUser,
) -> Ad:
    ad = db.scalar(
        select(Ad)
        .options(joinedload(Ad.owner))
        .where(Ad.id == ad_id)
    )

    if ad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado.",
        )

    if ad.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não possui permissão para editar este anúncio.",
        )

    update_data = ad_data.model_dump(exclude_unset=True)

    if "title" in update_data:
        update_data["title"] = update_data["title"].strip()

    if "description" in update_data:
        update_data["description"] = update_data["description"].strip()

    if "category" in update_data:
        update_data["category"] = update_data["category"].strip()

    if "image_url" in update_data and update_data["image_url"] is not None:
        update_data["image_url"] = str(update_data["image_url"])

    for field, value in update_data.items():
        setattr(ad, field, value)

    if ad.is_donation:
        ad.price = None
    elif ad.price is None or ad.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="O preço deve ser maior que zero quando não for doação.",
        )

    db.commit()
    db.refresh(ad)

    return ad


@router.delete(
    "/{ad_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Excluir anúncio",
)
def delete_ad(
        ad_id: int,
        db: DatabaseSession,
        current_user: CurrentUser,
) -> None:
    ad = db.get(Ad, ad_id)

    if ad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado.",
        )

    if ad.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não possui permissão para excluir este anúncio.",
        )

    db.delete(ad)
    db.commit()
