import React, { useState, useEffect } from "react";
import { getProducts } from "../../services/api";  // Reuse as campaigns

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    getProducts().then(res => setCampaigns(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Кампании</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Бюджет</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}