import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard    from "./pages/Dashboard";
import SetupDetail  from "./pages/SetupDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<Dashboard />} />
      <Route path="/setups/:id" element={<SetupDetail />} />
    </Routes>
  );
}
