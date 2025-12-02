import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar/navbar.jsx";
import AddStartup from "./pages/AddStartup";
import Dashboard from "./pages/dashboard.jsx";
import Analytics from "./pages/analytics.jsx";
import Login from "./pages/login.jsx";
import StartupDetails from "./pages/startupDetails.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/:id" element={<Analytics />} />
        <Route path="/addStartup" element={<AddStartup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/startup/:id" element={<StartupDetails />} /> {/* ✅ added */}
      </Routes>
    </>
  );
}

export default App;
