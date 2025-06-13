// src/pages/SetupDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function SetupDetail() {
  const { id } = useParams<{ id: string }>();
  const setupId = Number(id);
  const navigate = useNavigate();

  const [setup, setSetup] = useState<Setup | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state for the three toggles
  const [isCompression, setIsCompression]       = useState(false);
  const [hasOrderBlock, setHasOrderBlock]      = useState(false);
  const [isLiquidityTrap, setIsLiquidityTrap]  = useState(false);

  useEffect(() => {
    // Don't fire if invalid ID
    if (!setupId || Number.isNaN(setupId)) {
      setLoading(false);
      return;
    }

    async function loadSetup() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/setups/${setupId}`);
        if (!res.ok) throw new Error(`Fetch ${res.status}`);
        const data: Setup = await res.json();
        setSetup(data);
        setIsCompression(data.is_compression);
        setHasOrderBlock(data.has_order_block);
        setIsLiquidityTrap(data.is_liquidity_trap);
      } catch (err) {
        console.error("Error loading setup:", err);
        alert("Failed to load setup details.");
      } finally {
        setLoading(false);
      }
    }

    loadSetup();
  }, [setupId]);

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (!setup)  return <p className="p-8 text-center">Setup not found.</p>;

  // Helper to map "BTC/USD" → "BINANCE:BTCUSDT" etc.
  const formatSymbol = (pair: string) => {
    let base: string, quote: string;
    if (pair.includes("/")) {
      [base, quote] = pair.split("/");
    } else if (pair.toUpperCase().endsWith("USDT")) {
      base = pair.slice(0, -4); quote = "USDT";
    } else if (pair.toUpperCase().endsWith("USD")) {
      base = pair.slice(0, -3); quote = "USD";
    } else {
      base = pair; quote = "";
    }
    const mappedQuote = quote.toUpperCase() === "USD" ? "USDT" : quote.toUpperCase();
    return mappedQuote
      ? `BINANCE:${base.toUpperCase()}${mappedQuote}`
      : `BINANCE:${base.toUpperCase()}`;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/setups/${setupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_compression:    isCompression,
          has_order_block:   hasOrderBlock,
          is_liquidity_trap: isLiquidityTrap,
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      // once saved, refresh chart in place
      // we re-load the setup so ChartEmbed picks up the toggles
      const updated = await res.json();
      setSetup((s) => updated);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save tags.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {setup.asset.toUpperCase()} — {setup.direction}
      </h1>

      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <ChartEmbed
          symbol={formatSymbol(setup.asset)}
          interval="60"
          height={400}
          containerId={`tv-${setup.id}`}
          showCompression={isCompression}
          showOrderBlock={hasOrderBlock}
          showLiquidityTrap={isLiquidityTrap}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isCompression}
            onChange={() => setIsCompression((b) => !b)}
            className="h-5 w-5 text-green-600"
          />
          <span className="font-medium">Highlight Compression Zones</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={hasOrderBlock}
            onChange={() => setHasOrderBlock((b) => !b)}
            className="h-5 w-5 text-blue-600"
          />
          <span className="font-medium">Show Order Blocks</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isLiquidityTrap}
            onChange={() => setIsLiquidityTrap((b) => !b)}
            className="h-5 w-5 text-red-600"
          />
          <span className="font-medium">Mark Liquidity Traps</span>
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg shadow hover:from-green-600 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : "Save & Refresh Chart"}
        </button>
      </div>
    </div>
  );
}
