from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import analytics, auth, curriculum, execute, gamification, tutor, users
from app.core.config import settings

app = FastAPI(
    title="Vision AI API",
    version="0.1.0",
    description="FastAPI backend for the Vision AI coding tutor platform.",
)

# Parse CORS origins from environment (comma-separated for multiple origins)
cors_origins = [origin.strip() for origin in settings.cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST routers ────────────────────────────────────────────────────────────
app.include_router(analytics.router,    prefix="/api/v1")
app.include_router(auth.router,         prefix="/api/v1")
app.include_router(curriculum.router,  prefix="/api/v1")
app.include_router(execute.router,     prefix="/api/v1")
app.include_router(gamification.router, prefix="/api/v1")
app.include_router(tutor.router,       prefix="/api/v1")
app.include_router(users.router,       prefix="/api/v1")


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "version": "0.1.0"}


# ── WebSocket (real-time execution output) ───────────────────────────────────
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"echo:{data}")
    except WebSocketDisconnect:
        pass
