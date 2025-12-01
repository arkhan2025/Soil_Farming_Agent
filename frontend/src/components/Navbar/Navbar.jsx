// src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="nav-title">Soil Farming Portal</h2>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        
        {/* ▼ SHOW ONLY AFTER LOGIN ▼ */}
        {user && (
          <>
            <li>
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            </li>

            <li>
              <Link to="/soil-details" onClick={() => setOpen(false)}>Soil Details</Link>
            </li>

            <li>
              <Link to="/distributors" onClick={() => setOpen(false)}>Distributors</Link>
            </li>

            {isAdmin && (
              <li>
                <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
              </li>
            )}
          </>
        )}

        {/* ▼ PUBLIC WHEN NOT LOGGED IN ▼ */}
        {!user ? (
          <>
            <li>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </li>
          </>
        ) : (
          <li>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
