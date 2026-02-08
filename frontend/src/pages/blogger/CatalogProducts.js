import React, { useState, useEffect } from "react";
import { getCatalogProducts, applyToProduct } from "../../services/api";

export default function CatalogProducts() {
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ["Все", "В работе", "Ожидание"];
  const categories = ["all", "Красота", "Спорт", "Еда", "Техника"];

  useEffect(() => {
    getCatalogProducts({ status: statusFilter, category: categoryFilter }).then(res => setProducts(res.data)).catch(console.error);
  }, [statusFilter, categoryFilter]);

  const resetFilters = () => {
    setStatusFilter("Все");
    setCategoryFilter("all");
  };

  const handleApply = (productId) => {
    applyToProduct({ product_id: productId }).then(() => alert('Отклик отправлен')).catch(console.error);
  };

  return (
    <div>
      <h1>Каталог товаров</h1>
      <p>Выберите товары для вашей кампании</p>

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

          <label className="label">Категория</label>
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "Все категории" : c}
              </option>
            ))}
          </select>

          <button className="btn reset-btn" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>
      )}

      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "12px",
                backgroundColor: "#e5e7eb", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "24px", fontWeight: "bold", marginRight: "16px"
              }}>
                {product.name.charAt(0)}
              </div>
              <div>
                <h3>{product.name}</h3>
                <p>{product.brand}</p>
              </div>
            </div>

            <p><strong>Бюджет:</strong> {product.budget.toLocaleString()} ₽</p>
            <p><strong>Категория:</strong> {product.category}</p>
            <p><strong>Дедлайн:</strong> {product.deadline}</p>
            <p><strong>Статус:</strong> {product.status}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button className="btn btn-blue">Подробнее</button>
              <button className="btn btn-outline" onClick={() => handleApply(product.id)}>Откликнуться</button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="card empty-card">
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}