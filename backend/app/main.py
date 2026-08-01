from fastapi import FastAPI

app = FastAPI(
    title="Desapega Campus API",
    description="API do marketplace de economia circular universitária.",
    version="1.0.0",
)


@app.get("/", tags=["Health Check"])
def root() -> dict[str, str]:
    return {
        "message": "Desapega Campus API",
        "status": "running",
    }


@app.get("/health", tags=["Health Check"])
def health_check() -> dict[str, str]:
    return {"status": "healthy"}