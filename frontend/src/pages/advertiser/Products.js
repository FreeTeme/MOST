import React, { useState, useEffect } from "react";
import { getProducts, addProduct } from "../../services/api";

export default function AdvertiserProducts() {
  const [campaigns, setCampaigns] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: ""
  });

  useEffect(() => {
    getProducts().then(res => setCampaigns(res.data)).catch(console.error);
  }, []);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    addProduct(formData).then(res => {
      setCampaigns([...campaigns, res.data]);
      setFormData({ name: "", description: "", budget: "" });
      setIsCreating(false);
    }).catch(console.error);
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: "Активна",
      completed: "Завершена",
      draft: "Черновик"
    };
    return labels[status] || status;
  };

  return (
    <div>
      <h1>Кампании</h1>
      <p>Управление рекламными кампаниями и заявками</p>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Мои кампании</h2>
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            Создать кампанию
          </button>
        </div>

        {isCreating && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>Создание новой кампании</h3>
            <form onSubmit={handleCreateCampaign}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="label">Название кампании</label>
                  <input
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="label">Описание</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Бюджет (₽)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Создать</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Отмена</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-grid">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="card">
              <h3>{campaign.name}</h3>
              <p>Статус: {getStatusLabel(campaign.status)}</p>
              <p>Отклики: {campaign.responses || 0}</p>
              <p>Просмотры: {campaign.views || 0}</p>
              <button 
                className="btn btn-outline"
                style={{ marginTop: '10px' }}
                onClick={() => setSelectedCampaign(campaign)}
              >
                Посмотреть отклики
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCampaign && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Отклики на кампанию: {selectedCampaign.name}</h2>
            <button className="btn btn-outline" onClick={() => setSelectedCampaign(null)}>Закрыть</button>
          </div>
          
          <table className="table">
            <thead>
              <tr>
                <th>Блогер</th>
                <th>Платформа</th>
                <th>Подписчики</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {/* Fetch applications for selectedCampaign.id if needed, mock for now */}
              <tr>
                <td>Анна</td>
                <td>Instagram</td>
                <td>25K</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Написать
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}