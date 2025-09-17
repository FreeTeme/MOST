import React, { useState, useEffect } from "react";

export default function BloggerSocials() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [socials, setSocials] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    platform: "",
    followers: "",
    region: "",
    price: "",
    category: "",
    link: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/socials`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить соцсети');
      const data = await res.json();
      setSocials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = isEditing ? `${BASE_URL}/api/socials/${isEditing}` : `${BASE_URL}/api/socials`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-ID': localStorage.getItem('userId')
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(isEditing ? 'Не удалось обновить' : 'Не удалось добавить');
      await fetchSocials();
      setFormData({ platform: "", followers: "", region: "", price: "", category: "", link: "" });
      setIsAdding(false);
      setIsEditing(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/socials/${id}`, {
        method: 'DELETE',
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось удалить');
      await fetchSocials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (social) => {
    setIsEditing(social.id);
    setIsAdding(true);
    setFormData({
      platform: social.platform,
      followers: social.followers,
      region: social.region,
      price: social.price,
      category: social.category,
      link: social.link
    });
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
      <h1>Социальные сети</h1>
      <p>Управление вашими социальными сетями</p>

      <div className="card-grid">
        <div className="card">
          <h3>Показы карточки</h3>
          <p>1,245 просмотров</p> {/* Замени на API, если добавишь эндпоинт */}
        </div>
        <div className="card">
          <h3>Добавления в кампании</h3>
          <p>47 раз</p> {/* Замени на API, если нужно */}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Мои социальные сети</h2>
          <button className="btn btn-primary" onClick={() => { setIsAdding(true); setIsEditing(null); setFormData({ platform: "", followers: "", region: "", price: "", category: "", link: "" }); }}>
            Добавить соцсеть
          </button>
        </div>

        {isAdding && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>{isEditing ? 'Редактировать соцсеть' : 'Добавить новую соцсеть'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="label">Платформа</label>
                  <input
                    className="input"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Подписчики</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Регион</label>
                  <input
                    className="input"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Цена (₽)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Категория</label>
                  <input
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Ссылка</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Сохранить изменения' : 'Сохранить'}</button>
                <button type="button" className="btn btn-outline" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Отмена</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-grid">
          {socials.map(social => (
            <div key={social.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{social.platform}</h3>
                <div>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                    onClick={() => handleEdit(social)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleDelete(social.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p>Подписчики: {social.followers.toLocaleString()}</p>
              <p>Регион: {social.region}</p>
              <p>Цена: {social.price.toLocaleString()} ₽</p>
              <p>Категория: {social.category}</p>
              <a href={social.link} target="_blank" rel="noopener noreferrer">Перейти</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}