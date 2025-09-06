import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import Swipe from "./pages/Swipe";
import Profile from "./pages/Profile";
import Campaigns from "./pages/Campaigns";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/swipe" element={<Swipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
