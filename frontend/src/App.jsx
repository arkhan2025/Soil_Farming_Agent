// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
