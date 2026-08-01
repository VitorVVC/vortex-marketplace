from fastapi import FastAPI

from app.database.database import Base, engine
from app.models import Ad, User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Desapega Campus API",
    description="API do marketplace de economia circular universitária.",
    version="1.0.0",
)


# TODO -> Criar Docstrings para enriquecer mais o Swagger
@app.get("/", tags=["Health Check"])
def root() -> dict[str, str]:
    return {
        "message": "Desapega Campus API",
        "status": "running",
    }


@app.get("/health", tags=["Health Check"])
def health_check() -> dict[str, str]:
    """
    Verifica o estado de saúde da aplicação.
    Retorna o status atual para monitoramento do servidor.
    """
    return {"status": "healthy"}
