# backend/app/routers/setup.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_session
from app.models import Setup
from app.schemas import SetupCreate, SetupRead, SetupUpdate

router = APIRouter()

@router.post("/", response_model=SetupRead)
async def create_setup(
    data: SetupCreate,
    db: AsyncSession = Depends(get_session),
):
    setup = Setup(**data.dict())
    db.add(setup)
    await db.commit()
    await db.refresh(setup)
    return setup

@router.get("/", response_model=List[SetupRead])
async def list_setups(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Setup))
    return result.scalars().all()

@router.get("/{setup_id}", response_model=SetupRead)
async def read_setup(
    setup_id: int,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(
        select(Setup).where(Setup.id == setup_id)
    )
    setup = result.scalar_one_or_none()
    if not setup:
        raise HTTPException(404, "Setup not found")
    return setup

@router.patch("/{setup_id}",  response_model=SetupRead)
@router.patch("/{setup_id}/", response_model=SetupRead)
async def update_setup(
    setup_id: int,
    data: SetupUpdate,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(
        select(Setup).where(Setup.id == setup_id)
    )
    setup = result.scalar_one_or_none()
    if not setup:
        raise HTTPException(404, "Setup not found")
    for field, val in data.dict(exclude_unset=True).items():
        setattr(setup, field, val)
    await db.commit()
    await db.refresh(setup)
    return setup
