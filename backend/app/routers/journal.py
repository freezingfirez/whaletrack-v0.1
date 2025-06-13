from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import JournalEntry
from app.schemas import JournalCreate, JournalRead

router = APIRouter(prefix="/journal")

@router.post("/", response_model=JournalRead)
async def create_entry(data: JournalCreate, db: AsyncSession = Depends(get_session)):
    entry = JournalEntry(**data.dict())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry

@router.get("/", response_model=list[JournalRead])
async def list_entries(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(JournalEntry))
    return result.scalars().all()
