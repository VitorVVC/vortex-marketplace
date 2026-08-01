from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from pwdlib import PasswordHash

from ..core.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
        plain_password: str,
        hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
        subject: str | int,
        expires_delta: timedelta | None = None,
) -> str:
    expire = datetime.now(UTC) + (
            expires_delta
            or timedelta(
        minutes=settings.access_token_expire_minutes,
    )
    )

    payload: dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )

        subject = payload.get("sub")

        if subject is None:
            return None

        return int(subject)

    except (JWTError, ValueError):
        return None
