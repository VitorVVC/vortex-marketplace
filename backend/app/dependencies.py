from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.database import get_db
from app.models.user import User

bearer_scheme = HTTPBearer(
    scheme_name="JWT Bearer",
    description="Insira o token JWT recebido no login.",
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

BearerCredentials = Annotated[
    HTTPAuthorizationCredentials,
    Depends(bearer_scheme),
]


def get_current_user(
        credentials: BearerCredentials,
        db: DatabaseSession,
) -> User:
    user_id = decode_access_token(credentials.credentials)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if user_id is None:
        raise credentials_exception
    user = db.get(User, user_id)

    if user is None:
        raise credentials_exception
    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]
