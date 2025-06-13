# backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db import Base


class Setup(Base):
    __tablename__ = "setups"
    id            = Column(Integer, primary_key=True, index=True)
    asset         = Column(String, index=True, nullable=False)
    direction     = Column(String, nullable=False)
    # NEW columns:
    is_compression   = Column(Boolean, default=False)
    has_order_block  = Column(Boolean, default=False)
    is_liquidity_trap= Column(Boolean, default=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())


class Trade(Base):
    __tablename__ = "trades"

    id          = Column(Integer, primary_key=True, index=True)
    setup_id    = Column(Integer, ForeignKey("setups.id"), nullable=False)
    price       = Column(Float, nullable=False)
    size        = Column(Float, nullable=False)
    direction   = Column(String, nullable=False)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id         = Column(Integer, primary_key=True, index=True)
    setup_id   = Column(Integer, ForeignKey("setups.id"), nullable=False)
    notes      = Column(Text, nullable=True)
    result     = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
