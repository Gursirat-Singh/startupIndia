import "../navbar/nav.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png"; // ✅ Correct import since logo is in same folder

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav id="nav" className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <img src={logo} alt="InnoScope" className="logo-img" />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Links */}
        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link">
            Dashboard
          </Link>

          <Link to="/analytics" className="nav-link">
            Analytics
          </Link>

          <Link to="/addStartup" className="nav-link add-startup-btn">
            Add Startup
          </Link>

          <Link to="/login" className="nav-link nav-auth-btn">
            Login/Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
