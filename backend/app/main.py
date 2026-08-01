from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .database.database import Base, engine
from .models import Ad, User
from .routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description=settings.description,
    version=settings.version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/", tags=["Health Check"], summary="Página inicial da API", )
def root() -> dict[str, str]:
    return {
        "message": settings.app_name,
        "status": "running",
    }


@app.get("/health", tags=["Health Check"], summary="Verificar saúde da API", )
def health_check() -> dict[str, str]:
    """
    Verifica o estado de saúde da aplicação.
    Retorna o status atual para monitoramento do servidor.
    """
    return {"status": "healthy"}
