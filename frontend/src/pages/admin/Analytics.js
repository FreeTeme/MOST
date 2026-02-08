import React, { useState, useEffect } from "react";
import { getAdminAnalytics } from "../../services/api";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({ total_users: 0, avg_er: 0 });

  useEffect(() => {
    getAdminAnalytics().then(res => setAnalytics(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Аналитика</h1>
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