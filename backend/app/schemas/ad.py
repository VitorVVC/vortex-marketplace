from datetime import datetime
from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    model_validator,
)


class AdCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=120,
        examples=["Calculadora científica Casio"],
    )
    description: str = Field(
        min_length=10,
        max_length=1000,
        examples=["Calculadora em ótimo estado, pouco utilizada."],
    )
    category: str = Field(
        min_length=2,
        max_length=50,
        examples=["Engenharia"],
    )
    price: Decimal | None = Field(
        default=None,
        ge=0,
        decimal_places=2,
        examples=[120.00],
    )
    is_donation: bool = False
    image_url: HttpUrl | None = Field(
        default=None,
        examples=["https://example.com/calculadora.jpg"],
    )

    @model_validator(mode="after")
    def validate_price_and_donation(self) -> "AdCreate":
        if self.is_donation:
            self.price = None
            return self

        if self.price is None:
            raise ValueError(
                "O preço é obrigatório quando o anúncio não é uma doação."
            )

        if self.price <= 0:
            raise ValueError(
                "O preço deve ser maior que zero."
            )

        return self


class AdOwnerResponse(BaseModel):
    id: int = Field(examples=[1])
    name: str = Field(examples=["Vitor Vargas"])

    model_config = ConfigDict(from_attributes=True)


class AdResponse(BaseModel):
    id: int = Field(examples=[1])
    title: str = Field(examples=["Calculadora científica Casio"])
    description: str = Field(
        examples=["Calculadora em ótimo estado e funcionando perfeitamente."]
    )
    category: str = Field(examples=["Engenharia"])
    price: Decimal | None = Field(
        default=None,
        examples=[Decimal("120.00")],
    )
    is_donation: bool = Field(examples=[False])
    image_url: str | None = Field(
        default=None,
        examples=[
            "https://images_teste.com/"
        ],
    )
    owner_id: int = Field(examples=[1])
    owner: AdOwnerResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdListResponse(BaseModel):
    items: list[AdResponse]
    total: int
    page: int
    page_size: int

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "items": [
                        {
                            "id": 1,
                            "title": "Calculadora científica Casio",
                            "description": (
                                "Calculadora em ótimo estado "
                                "e funcionando perfeitamente."
                            ),
                            "category": "Engenharia",
                            "price": "120.00",
                            "is_donation": False,
                            "image_url": (
                                "https://images_teste.com/"
                            ),
                            "owner_id": 1,
                            "owner": {
                                "id": 1,
                                "name": "Vitor Vargas",
                            },
                            "created_at": "2026-08-01T17:00:00Z",
                        }
                    ],
                    "total": 1,
                    "page": 1,
                    "page_size": 12,
                }
            ]
        }
    )


class AdUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=120,
    )
    description: str | None = Field(
        default=None,
        min_length=10,
        max_length=1000,
    )
    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )
    price: Decimal | None = Field(
        default=None,
        ge=0,
        decimal_places=2,
    )
    is_donation: bool | None = None
    image_url: HttpUrl | None = None
