import asyncio

# make sure all your models are registered on Base.metadata
import app.models

from app.db import engine, Base

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(main())
