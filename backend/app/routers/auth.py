from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from ..core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from ..dependencies import CurrentUser, DatabaseSession
from ..models.user import User
from ..schemas.user import (
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar usuário",
)
def register_user(
        user_data: UserCreate,
        db: DatabaseSession,
) -> User:
    normalized_email = user_data.email.lower()

    existing_user = db.scalar(
        select(User).where(
            User.email == normalized_email,
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário cadastrado com este e-mail.",
        )

    user = User(
        name=user_data.name.strip(),
        email=normalized_email,
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Autenticar usuário",
)
def login(
        credentials: LoginRequest,
        db: DatabaseSession,
) -> TokenResponse:
    normalized_email = credentials.email.lower()

    user = db.scalar(
        select(User).where(
            User.email == normalized_email,
        )
    )

    if user is None or not verify_password(
            credentials.password,
            user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=user.id,
    )

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Consultar usuário autenticado",
)
def get_authenticated_user(
        current_user: CurrentUser,
) -> User:
    return current_user
