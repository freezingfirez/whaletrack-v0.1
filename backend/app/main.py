# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, setup, trade, journal

app = FastAPI()

# ─── CORS ───────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTERS ────────────────────────────────────────────────────────────
app.include_router(health.router,   prefix="/health", tags=["health"])
app.include_router(setup.router,    prefix="/setups", tags=["setups"])
app.include_router(trade.router,    prefix="/trades", tags=["trades"])
app.include_router(journal.router,  prefix="/journal", tags=["journal"])
