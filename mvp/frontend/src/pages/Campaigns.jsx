import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");

  const loadCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/campaigns/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data);
    } catch {
      alert("Ошибка загрузки кампаний");
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const createCampaign = async () => {
    try {
      await axios.post("http://localhost:5000/api/campaigns/", { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName("");
      loadCampaigns();
    } catch {
      alert("Ошибка создания кампании");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Мои кампании</h2>
      <input
        placeholder="Название кампании"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createCampaign}>Создать кампанию</button>

      <ul>
        {campaigns.map(c => (
          <li key={c.id} style={{ margin: "10px 0" }}>
            <b>{c.name}</b>
            <ul>
              {c.bloggers.map(b => (
                <li key={b.id}>{b.profile_url}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
