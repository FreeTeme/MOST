import React, { useState, useEffect } from "react";

export default function AdvertiserProducts() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [campaigns, setCampaigns] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    brand: "",
    category: "",
    deadline: "",
    status: "pending"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить кампании');
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (campaignId) => {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products/${campaignId}/applications`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить отклики');
      const data = await res.json();
      setApplications(data);
      setSelectedCampaign(campaignId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateOrUpdateCampaign = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = isEditing ? `${BASE_URL}/api/products/${isEditing}` : `${BASE_URL}/api/products`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-ID': localStorage.getItem('userId')
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(isEditing ? 'Не удалось обновить' : 'Не удалось создать');
      await fetchCampaigns();
      setFormData({ name: "", description: "", budget: "", brand: "", category: "", deadline: "", status: "pending" });
      setIsCreating(false);
      setIsEditing(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCampaign = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось удалить');
      await fetchCampaigns();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (campaign) => {
    setIsEditing(campaign.id);
    setIsCreating(true);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      budget: campaign.budget,
      brand: campaign.brand || "",
      category: campaign.category || "",
      deadline: campaign.deadline ? campaign.deadline.split('T')[0] : "",
      status: campaign.status
    });
  };

  const getStatusLabel = (status) => {
    const labels = { pending: "Ожидание", in_work: "В работе", completed: "Завершена" };
    return labels[status] || status;
  };

  if (loading) return <div className="loader">Загрузка...</div>;
  if (error) return (
    <div className="error-modal">
      <div className="modal-content">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => setError(null)}>Закрыть</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1>Кампании</h1>
      <p>Управление рекламными кампаниями и заявками</p>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Мои кампании</h2>
          <button className="btn btn-primary" onClick={() => { setIsCreating(true); setIsEditing(null); setFormData({ name: "", description: "", budget: "", brand: "", category: "", deadline: "", status: "pending" }); }}>
            Создать кампанию
          </button>
        </div>

        {isCreating && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>{isEditing ? 'Редактировать кампанию' : 'Создание новой кампании'}</h3>
            <form onSubmit={handleCreateOrUpdateCampaign}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="label">Название кампании</label>
                  <input
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Описание</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Бюджет</label>
                  <input
                    className="input"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Бренд</label>
                  <input
                    className="input"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Категория</label>
                  <input
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Дедлайн</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Статус</label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Ожидание</option>
                    <option value="in_work">В работе</option>
                    <option value="completed">Завершена</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Сохранить изменения' : 'Создать'}</button>
                <button type="button" className="btn btn-outline" onClick={() => { setIsCreating(false); setIsEditing(null); }}>Отмена</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-grid">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="card">
              <h3>{campaign.name}</h3>
              <p>Статус: {getStatusLabel(campaign.status)}</p>
              <p>Бюджет: {campaign.budget}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => handleEdit(campaign)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleDeleteCampaign(campaign.id)}
                >
                  Удалить
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => fetchApplications(campaign.id)}
                >
                  Отклики
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCampaign && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Отклики на кампанию: {campaigns.find(c => c.id === selectedCampaign)?.name}</h2>
            <button className="btn btn-outline" onClick={() => setSelectedCampaign(null)}>Закрыть</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Блогер</th>
                <th>Статус</th>
                <th>Дата отклика</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.blogger_name}</td>
                  <td>{getStatusLabel(app.status)}</td>
                  <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Написать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}