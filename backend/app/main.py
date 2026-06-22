from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import execute, tutor, users

app = FastAPI(
    title="Invincia Platform API",
    version="0.1.0",
    description="FastAPI backend for the Invincia AI coding tutor platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST routers ────────────────────────────────────────────────────────────
app.include_router(execute.router, prefix="/api/v1")
app.include_router(tutor.router,   prefix="/api/v1")
app.include_router(users.router,   prefix="/api/v1")


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
