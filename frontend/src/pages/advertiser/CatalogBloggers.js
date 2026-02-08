import React, { useState, useEffect } from "react";
import { getCatalogBloggers } from "../../services/api";

export default function CatalogBloggers() {
  const [bloggers, setBloggers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ["Все", "В работе", "Ожидание"];
  const allCategories = ["all", "Красота", "Уход", "Техника", "Гаджеты", "Еда", "Рецепты", "Спорт", "Фитнес"];

  useEffect(() => {
    getCatalogBloggers({
      search: searchTerm, category: categoryFilter, min_followers: minFollowers, max_price: maxPrice
    }).then(res => setBloggers(res.data)).catch(console.error);
  }, [searchTerm, categoryFilter, minFollowers, maxPrice, statusFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setMinFollowers(0);
    setMaxPrice(100000);
    setStatusFilter("Все");
  };

  return (
    <div>
      <h1>Каталог блогеров</h1>
      <p>Найдите подходящих блогеров для вашей кампании</p>

      <div className="status-bar">
        {statuses.map(st => (
          <div
            key={st}
            className={`status-item ${statusFilter === st ? "active" : ""}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </div>
        ))}
      </div>

      <button className="filters-btn" onClick={() => setShowFilters(!showFilters)}>
        Фильтры
      </button>

      {showFilters && (
        <div className="card filter-card">
          <div className="filter-header">
            <h3>Фильтры</h3>
            <button className="filter-close" onClick={() => setShowFilters(false)}>✕</button>
          </div>

          <label className="label">Поиск по имени</label>
          <input
            type="text"
            className="input"
            placeholder="Имя блогера..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

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

          <button className="btn reset-btn" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>
      )}

      <div className="card-grid">
        {bloggers.map(blogger => (
          <div key={blogger.id} className="card">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "30px",
                backgroundColor: "#e5e7eb", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "20px", marginRight: "16px"
              }}>
                {blogger.name.charAt(0)}
              </div>
              <div>
                <h3>{blogger.name}</h3>
                <p>{blogger.followers.toLocaleString()} подписчиков</p>
              </div>
            </div>
            
            <p><strong>ER:</strong> {blogger.er}%</p>
            <p><strong>Цена:</strong> {blogger.price.toLocaleString()} ₽</p>
            <div>
              <strong>Категории:</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                {blogger.categories.map((category, index) => (
                  <span key={index} style={{ 
                    backgroundColor: "#e5e7eb", 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px" 
                  }}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button className="btn btn-blue">Подробнее</button>
              <button className="btn btn-outline">Предложить сотрудничество</button>
            </div>
          </div>
        ))}
      </div>

      {bloggers.length === 0 && (
        <div className="card empty-card">
          <h3>Блогеры не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}