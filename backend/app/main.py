"""
Vision AI Backend - FastAPI Application
=====================================
Main application entry point with Socket.IO integration.
"""

from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import (
    analytics,
    auth,
    career,
    collaboration,
    curriculum,
    execute,
    gamification,
    tutor,
    users,
)
from app.core.config import settings
from app.services.socket_manager import sio


# ─────────────────────────────────────────────────────────────────────────────
# LIFESPAN CONTEXT MANAGER
# ─────────────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚀 Vision AI Backend starting...")
    print("📡 Socket.IO server ready on port 8000")
    yield
    # Shutdown
    print("👋 Vision AI Backend shutting down...")


# ─────────────────────────────────────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Vision AI API",
    version="1.0.0",
    description="AI-powered visual coding platform with real-time collaboration",
    lifespan=lifespan,
)

# Parse CORS origins from environment
cors_origins = [origin.strip() for origin in settings.cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST API Routers ────────────────────────────────────────────────────────
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(career.router, prefix="/api/v1")
app.include_router(collaboration.router, prefix="/api/v1")
app.include_router(curriculum.router, prefix="/api/v1")
app.include_router(execute.router, prefix="/api/v1")
app.include_router(gamification.router, prefix="/api/v1")
app.include_router(tutor.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")


# ── Health Check ────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "api": "running",
            "socket_io": "running",
        },
    }


# ─────────────────────────────────────────────────────────────────────────────
# SOCKET.IO INTEGRATION
# ─────────────────────────────────────────────────────────────────────────────

# Mount Socket.IO ASGI app on the FastAPI application
# This allows both REST endpoints and Socket.IO to share port 8000
socket_app = socketio.ASGIApp(sio, app)
