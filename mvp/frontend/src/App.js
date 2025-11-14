import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/shared/Dashboard";
import Reviews from "./pages/shared/Reviews";
import EntityManager from "./pages/shared/EntityManager";
import Catalog from "./pages/shared/Catalog";
import AdminUsers from "./pages/admin/Users";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminAnalytics from "./pages/admin/Analytics";

function App() {
  const role = localStorage.getItem('role') || 'blogger';  // Fallback

  return (
    <Routes>
      {/* Нет /login и /register */}

      {/* Блогер */}
      <Route path="/blogger" element={<Layout role="blogger" />}>
        <Route index element={<Dashboard role="blogger" currentUser={{ id: 1 }} />} />
        <Route path="reviews" element={<Reviews role="blogger" />} />
        <Route path="socials" element={<EntityManager entityType="socials" />} />
        <Route path="catalog" element={<Catalog entityType="products" />} />
      </Route>

      {/* Рекламодатель */}
      <Route path="/advertiser" element={<Layout role="advertiser" />}>
        <Route index element={<Dashboard role="advertiser" />} />
        <Route path="reviews" element={<Reviews role="advertiser" />} />
        <Route path="products" element={<EntityManager entityType="products" />} />
        <Route path="catalog" element={<Catalog entityType="bloggers" />} />
      </Route>

      {/* Админ */}
      <Route path="/admin" element={<Layout role="admin" />}>
        <Route index element={<Dashboard role="admin" />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* По умолчанию */}
      <Route path="*" element={<Navigate to={`/${role}`} replace />} />
    </Routes>
  );
}

export default App;