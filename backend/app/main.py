from fastapi import FastAPI

app = FastAPI(
    title = "Event Hall Management Sustem API",
    version = "0.1.0",
)

@app.get("/health")
def health_check() -> dict[str, str]:
    return{"status":"ok"}