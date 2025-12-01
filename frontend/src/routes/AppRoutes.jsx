// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../components/Home/Home.jsx";
import AdminDashboard from "../components/AdminDashboard/AdminDashboard.jsx";
import PostSoil from "../components/PostSoil/PostSoil.jsx";
import PostDistributor from "../components/PostDistributor/PostDistributor.jsx";
import RegisterUser from "../components/RegisterUser/RegisterUser.jsx";
import LoginUser from "../components/LoginUser/LoginUser.jsx";
import ViewSoilDetails from "../components/ViewSoilDetails/ViewSoilDetails.jsx";
import ViewDistributor from "../components/ViewDistributor/ViewDistributor.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/soil-details" element={<ProtectedRoute><ViewSoilDetails /></ProtectedRoute>} />
      <Route path="/distributors" element={<ProtectedRoute><ViewDistributor /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/post-soil"
        element={
          <AdminRoute>
            <PostSoil />
          </AdminRoute>
        }
      />

      <Route
        path="/post-distributor"
        element={
          <AdminRoute>
            <PostDistributor />
          </AdminRoute>
        }
      />

      {/* Public */}
      <Route path="/login" element={<LoginUser />} />
      <Route path="/register" element={<RegisterUser />} />
    </Routes>
  );
};

export default AppRoutes;
