from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
        examples=["Vitor Vargas"],
    )
    email: EmailStr = Field(
        examples=["vitor@email.com"],
    )
    password: str = Field(
        min_length=8,
        max_length=72,
        examples=["senha-segura-123"],
    )


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr = Field(examples=["vitor@email.com"])
    password: str = Field(examples=["senha-segura-123"])


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
