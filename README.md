# WhaleTrack Crypto Execution App

A lightweight “sniper rifle” for detecting and tracking crypto “whale” order-flow setups. Built as a FastAPI + React/Tailwind MVP, WhaleTrack lets you:

- 🔍 **Scan & tag** compression zones, order-blocks, and liquidity traps  
- 📈 **Embed TradingView** charts with custom PineScript overlays  
- 📝 **Journal** each setup with notes and results  
- ⚙️ **One-click execution** (GMX / Coinbase Pro / Kraken) — coming soon!

---

## 🚀 Features

- **Dashboard**  
  • Quick filter by Compression / Order-Block / Liquidity-Trap  
  • Live TradingView “tv-widget” embeds per setup  
  • Colored tag badges & date stamps

- **Setup Detail**  
  • Full-screen chart with resizable height  
  • Toggle overlays on/off via checkboxes  
  • Save tags back to backend (PATCH)

- **Backend API**  
  - `GET /setups`  
  - `POST /setups`  
  - `GET /setups/{id}`  
  - `PATCH /setups/{id}`  
  - (plus trades & journal endpoints)

---

## 📦 Tech Stack

| Layer           | Tech                                 |
| --------------- | ------------------------------------ |
| **Frontend**    | React, TypeScript, Tailwind CSS      |
| **Charting**    | TradingView Widget API, PineScript   |
| **Backend**     | Python, FastAPI, SQLAlchemy (async)  |
| **Database**    | PostgreSQL (via Docker Compose)      |
| **Dev & Deploy**| Vercel (frontend), Docker + Supabase |

---

## 🔧 Installation & Setup

1. **Clone repo**  
   ```bash
   git clone https://github.com/freezingfirez/whaletrack-v0.1.git
   cd whaletrack
