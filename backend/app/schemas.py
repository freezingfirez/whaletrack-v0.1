# backend/app/schemas.py

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

# ─── Setup DTOs ────────────────────────────────────────────────────────────────

class SetupCreate(BaseModel):
    asset: str
    direction: str  # "long" or "short"

class SetupRead(BaseModel):
    id:                int
    asset:             str
    direction:         str
    # ─── New boolean tag fields ───────────────────────────────────────────────
    is_compression:    bool
    has_order_block:   bool
    is_liquidity_trap: bool
    # ────────────────────────────────────────────────────────────────────────────
    created_at:        datetime

    # Pydantic v2: pull values from ORM attributes
    model_config = ConfigDict(from_attributes=True)

class SetupUpdate(BaseModel):
    # default to None so you can PATCH any subset
    is_compression:    Optional[bool] = None
    has_order_block:   Optional[bool] = None
    is_liquidity_trap: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


# ─── Trade DTOs ────────────────────────────────────────────────────────────────

class TradeCreate(BaseModel):
    setup_id:  int
    price:     float
    size:      float
    direction: str

class TradeRead(TradeCreate):
    id:          int
    executed_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ─── Journal DTOs ──────────────────────────────────────────────────────────────

class JournalCreate(BaseModel):
    setup_id: int
    notes:    Optional[str] = None
    result:   Optional[str] = None

class JournalRead(JournalCreate):
    id:         int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
