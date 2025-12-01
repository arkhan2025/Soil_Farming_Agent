import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => (
  <div className="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <div className="admin-actions">
      <Link to="/post-soil" className="admin-btn">Post Soil Details</Link>
      <Link to="/post-distributor" className="admin-btn">Post Distributor Details</Link>
    </div>
  </div>
);

export default AdminDashboard;
