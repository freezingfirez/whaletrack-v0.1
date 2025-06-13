// src/pages/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChartEmbed } from "../components/ChartEmbed";

interface Setup {
  id: number;
  asset: string;
  direction: "long" | "short";
  is_compression: boolean;
  has_order_block: boolean;
  is_liquidity_trap: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [filters, setFilters] = useState({
    compression: false,
    orderBlock: false,
    liquidityTrap: false,
  });

  useEffect(() => { fetchSetups(); }, []);
  const fetchSetups = async () => {
    try {
      const res = await fetch("http://localhost:8000/setups");
      if (!res.ok) throw new Error(res.statusText);
      setSetups(await res.json());
    } catch (e) { console.error(e); }
  };

  const toggle = (key: keyof typeof filters) => {
    setFilters(f => ({ ...f, [key]: !f[key] }));
  };

  const filtered = setups.filter(s => 
    (!filters.compression || s.is_compression) &&
    (!filters.orderBlock  || s.has_order_block)  &&
    (!filters.liquidityTrap || s.is_liquidity_trap)
  );

  const formatSymbol = (pair: string) => {
    let base = pair.replace(/\W/g, "");
    let quote = base.endsWith("USDT") ? "USDT" : base.endsWith("USD") ? "USD" : "";
    base = quote ? base.slice(0, -quote.length) : base;
    const mapped = quote === "USD" ? "USDT" : quote;
    return `BINANCE:${base.toUpperCase()}${mapped}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-extrabold text-blue-800">🦈 WhaleTrack</h1>
        <div className="flex gap-3">
          {([['compression','Compression'], ['orderBlock','Order Block'], ['liquidityTrap','Liquidity Trap']] as const).map(([key,label]) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`px-4 py-2 rounded-full font-medium border transition 
                ${filters[key] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'}`}
            >{label}</button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">No setups match those filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <Link
              key={s.id}
              to={`/setups/${s.id}`}
              className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-4 border-b group-hover:border-blue-300">
                <h2 className="text-2xl font-bold text-gray-800">
                  {s.asset.toUpperCase()} <span className="text-sm text-gray-500">— {s.direction}</span>
                </h2>
              </div>
              <ChartEmbed
                symbol={formatSymbol(s.asset)}
                interval="60"
                height={180}
                containerId={`tv-${s.id}`}
              />
              <div className="p-4 flex flex-wrap items-center gap-2">
                {s.is_compression && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Compression</span>}
                {s.has_order_block && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Order Block</span>}
                {s.is_liquidity_trap && <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Liquidity Trap</span>}
              </div>
              <div className="px-4 pb-4">
                <small className="text-gray-500">{new Date(s.created_at).toLocaleString()}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
