import React, { useState, useEffect } from "react";

export default function CatalogProducts() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ["Все", "В работе", "Ожидание"];
  const categories = ["all", "Красота", "Спорт", "Еда", "Техника"];

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/catalog/products?status=${statusFilter}&category=${categoryFilter}`);
      if (!res.ok) throw new Error('Не удалось загрузить товары');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (productId) => {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products/${productId}/apply`, {
        method: 'POST',
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось отправить отклик');
      alert('Отклик отправлен');
    } catch (err) {
      setError(err.message);
    }
  };

  const resetFilters = () => {
    setStatusFilter("Все");
    setCategoryFilter("all");
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
      <h1>Каталог товаров</h1>
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
        <div className="card" style={{ marginBottom: "16px" }}>
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
          <button className="btn reset-btn" onClick={resetFilters}>Сбросить фильтры</button>
        </div>
      )}

      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card clickable">
            <h3>{product.name}</h3>
            <p><strong>Бренд:</strong> {product.brand || '-'}</p>
            <p><strong>Бюджет:</strong> {product.budget}</p>
            <p><strong>Категория:</strong> {product.category || '-'}</p>
            <p><strong>Дедлайн:</strong> {product.deadline ? new Date(product.deadline).toLocaleDateString() : '-'}</p>
            <p><strong>Статус:</strong> {product.status === 'pending' ? 'Ожидание' : product.status === 'in_work' ? 'В работе' : 'Завершена'}</p>
            <button className="btn btn-outline" style={{ marginTop: "10px" }} onClick={() => handleApply(product.id)}>
              Откликнуться
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}