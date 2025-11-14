// pages/shared/Catalog.js
import React, { useState, useEffect } from "react";
import { catalogConfigs } from "../../utils/roleConfigs";

export default function Catalog({ entityType }) {
  const config = catalogConfigs[entityType];
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ["Все", "В работе", "Ожидание"];

  useEffect(() => {
    const params = { status: statusFilter !== 'Все' ? statusFilter : undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined };
    if (config.filters.search) params.search = searchTerm;
    if (config.filters.minFollowers) params.min_followers = minFollowers;
    if (config.filters.maxPrice) params.max_price = maxPrice;
    config.apiMethod(params).then(res => setItems(res.data)).catch(console.error);
  }, [statusFilter, categoryFilter, searchTerm, minFollowers, maxPrice, entityType]);

  const resetFilters = () => {
    setStatusFilter("Все");
    setCategoryFilter("all");
    setSearchTerm("");
    setMinFollowers(0);
    setMaxPrice(100000);
  };

  return (
    <div>
      <h1>{config.title}</h1>
      <p>{config.subtitle}</p>

      {config.filters.status && (
        <div className="status-bar">
          {statuses.map(st => (
            <div key={st} className={`status-item ${statusFilter === st ? "active" : ""}`} onClick={() => setStatusFilter(st)}>
              {st}
            </div>
          ))}
        </div>
      )}

      <button className="filters-btn" onClick={() => setShowFilters(!showFilters)}>
        Фильтры
      </button>

      {showFilters && (
        <div className="card filter-card">
          <div className="filter-header">
            <h3>Фильтры</h3>
            <button className="filter-close" onClick={() => setShowFilters(false)}>✕</button>
          </div>

          {config.filters.search && (
            <>
              <label className="label">Поиск по имени</label>
              <input type="text" className="input" placeholder="Имя..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </>
          )}

          {config.filters.category && (
            <>
              <label className="label">Категория</label>
              <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {config.categories.map(c => <option key={c} value={c}>{c === "all" ? "Все категории" : c}</option>)}
              </select>
            </>
          )}

          {config.filters.minFollowers && (
            <>
              <label className="label">Мин. подписчиков: {minFollowers.toLocaleString()}</label>
              <input type="range" min="0" max="100000" step="5000" className="input" value={minFollowers} onChange={(e) => setMinFollowers(Number(e.target.value))} />
            </>
          )}

          {config.filters.maxPrice && (
            <>
              <label className="label">Макс. цена: {maxPrice.toLocaleString()} ₽</label>
              <input type="range" min="0" max="50000" step="1000" className="input" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            </>
          )}

          <button className="btn reset-btn" onClick={resetFilters}>Сбросить фильтры</button>
        </div>
      )}

      <div className="card-grid">
        {items.map(item => (
          <div key={item.id} className="card">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "12px", backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", marginRight: "16px" }}>
                {item[config.cardFields[0]].charAt(0)}
              </div>
              <div>
                <h3>{item[config.cardFields[0]]}</h3>
                <p>{item[config.cardFields[1]]}</p> {/* Второй field как sub */}
              </div>
            </div>
            {config.cardFields.slice(2).map(field => (
              <p key={field}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {Array.isArray(item[field]) ? item[field].join(', ') : item[field]}</p>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              {config.actions.map((action, idx) => (
                <button key={idx} className={action.class} onClick={() => action.onClick?.(item.id)}>{action.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card empty-card">
          <h3>Не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}