import React, { useState, useEffect } from "react";
import { getAdminAnalytics } from "../../services/api";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({ total_users: 0, avg_er: 0 });

  useEffect(() => {
    getAdminAnalytics().then(res => setAnalytics(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Админ Панель</h1>
      <p>Обзор системы</p>
      <div className="card-grid">
        <div className="card">
          <h3>Всего пользователей</h3>
          <p>{analytics.total_users}</p>
        </div>
        <div className="card">
          <h3>Средний ER</h3>
          <p>{analytics.avg_er}%</p>
        </div>
      </div>
    </div>
  );
}