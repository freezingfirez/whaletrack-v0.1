import { Routes, Route } from "react-router-dom";
import Dashboard    from "./pages/Dashboard";
import SetupDetail  from "./pages/SetupDetail";
import NewSetup     from "./pages/NewSetup";

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<Dashboard />} />
      <Route path="/new"        element={<NewSetup />} />
      <Route path="/setups/:id" element={<SetupDetail />} />
    </Routes>
  );
}
