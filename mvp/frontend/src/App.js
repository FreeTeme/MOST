import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/login/Login";
// import Register from "./login/Register";
import BloggerDashboard from "./pages/blogger/Dashboard";
import BloggerReviews from "./pages/blogger/Reviews";
import BloggerSocials from "./pages/blogger/Socials";
// import BloggerSupport from "./pages/blogger/Support";
// import BloggerProfile from "./pages/blogger/Profile";
import CatalogProducts from "./pages/blogger/CatalogProducts";
import SwipeProducts from "./pages/blogger/SwipeProducts";
import AdvertiserDashboard from "./pages/advertiser/Dashboard";
import AdvertiserReviews from "./pages/advertiser/Reviews";
import AdvertiserProducts from "./pages/advertiser/Products";
// import AdvertiserSupport from "./pages/advertiser/Support";
// import AdvertiserProfile from "./pages/advertiser/Profile";
import CatalogBloggers from "./pages/advertiser/CatalogBloggers";
import SwipeBloggers from "./pages/advertiser/SwipeBloggers";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminAnalytics from "./pages/admin/Analytics";
// import AdminSupport from "./pages/admin/Support";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/blogger" element={<Layout role="blogger" />}>
        <Route index element={<BloggerDashboard />} />
        <Route path="reviews" element={<BloggerReviews />} />
        <Route path="socials" element={<BloggerSocials />} />
        <Route path="catalog" element={<CatalogProducts />} />
        <Route path="swipe" element={<SwipeProducts />} />
        {/* <Route path="support" element={<BloggerSupport />} /> */}
        {/* <Route path="profile" element={<BloggerProfile />} /> */}
      </Route>
      <Route path="/advertiser" element={<Layout role="advertiser" />}>
        <Route index element={<AdvertiserDashboard />} />
        <Route path="reviews" element={<AdvertiserReviews />} />
        <Route path="products" element={<AdvertiserProducts />} />
        <Route path="catalog" element={<CatalogBloggers />} />
        <Route path="swipe" element={<SwipeBloggers />} />
        {/* <Route path="support" element={<AdvertiserSupport />} /> */}
        {/* <Route path="profile" element={<AdvertiserProfile />} /> */}
      </Route>
      <Route path="/admin" element={<Layout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        {/* <Route path="support" element={<AdminSupport />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;