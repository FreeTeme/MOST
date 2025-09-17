import React, { useState, useEffect } from "react";

export default function CatalogBloggers() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [bloggers, setBloggers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allCategories = ["all", "Красота", "Уход", "Техника", "Гаджеты", "Еда", "Рецепты", "Спорт", "Фитнес"];

  useEffect(() => {
    fetchBloggers();
  }, [searchTerm, categoryFilter, minFollowers, maxPrice]);

  const fetchBloggers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/catalog/bloggers?search=${searchTerm}&category=${categoryFilter}&min_followers=${minFollowers}&max_price=${maxPrice}`);
      if (!res.ok) throw new Error('Не удалось загрузить блогеров');
      const data = await res.json();
      setBloggers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <h1>Каталог блогеров</h1>
      <p>Найдите подходящих блогеров для вашей кампании</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="label">Поиск по имени</label>
            <input
              type="text"
              className="input"
              placeholder="Имя блогера..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Категория</label>
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Все категории" : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Мин. подписчиков: {minFollowers.toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              className="input"
              value={minFollowers}
              onChange={(e) => setMinFollowers(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Макс. цена: {maxPrice.toLocaleString()} ₽</label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              className="input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="card-grid">
        {bloggers.map(blogger => (
          <div key={blogger.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '30px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '16px' }}>
                {blogger.name.charAt(0)}
              </div>
              <div>
                <h3>{blogger.name}</h3>
                <p>{blogger.followers.toLocaleString()} подписчиков</p>
              </div>
            </div>
            <p><strong>Регион:</strong> {blogger.region}</p>
            <p><strong>Цена:</strong> {blogger.price.toLocaleString()} ₽</p>
            <div>
              <strong>Категории:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {blogger.categories.map((category, index) => (
                  <span key={index} style={{ backgroundColor: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary">Подробнее</button>
              <button className="btn btn-outline">Предложить сотрудничество</button>
            </div>
          </div>
        ))}
      </div>

      {bloggers.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Блогеры не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}