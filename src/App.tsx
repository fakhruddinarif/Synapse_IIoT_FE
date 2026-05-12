import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/dashboard";
import DevicesPage from "./pages/devices";

/** Root application entry for routing. */
export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/*" element={<DashboardPage />} />
      <Route path="/devices/*" element={<DevicesPage />} />
    </Routes>
  </BrowserRouter>
);
