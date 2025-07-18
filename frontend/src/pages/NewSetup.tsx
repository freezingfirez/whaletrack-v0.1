import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewSetup() {
  const navigate = useNavigate();
  const [asset, setAsset] = useState("");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/setups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, direction }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const setup = await res.json();
      navigate(`/setups/${setup.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create setup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6">New Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-md">
        <div>
          <label className="block font-medium mb-1">Asset Pair</label>
          <input value={asset} onChange={e => setAsset(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value as 'long' | 'short')} className="w-full border rounded px-3 py-2">
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <button disabled={saving} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Creating…" : "Create Setup"}
        </button>
      </form>
    </div>
  );
}
