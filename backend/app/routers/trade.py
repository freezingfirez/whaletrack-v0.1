from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Trade
from app.schemas import TradeCreate, TradeRead  # we’ll add these next

router = APIRouter(prefix="/trades")

@router.post("/", response_model=TradeRead)
async def create_trade(data: TradeCreate, db: AsyncSession = Depends(get_session)):
    trade = Trade(**data.dict())
    db.add(trade)
    await db.commit()
    await db.refresh(trade)
    return trade

@router.get("/", response_model=list[TradeRead])
async def list_trades(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Trade))
    return result.scalars().all()
