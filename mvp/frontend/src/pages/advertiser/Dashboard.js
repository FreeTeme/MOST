import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdvertiserDashboard() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState({ active_campaigns: 0, total_responses: 0, avg_rating: 0.0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resAnalytics = await fetch(`${BASE_URL}/api/dashboard/advertiser`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!resAnalytics.ok) throw new Error('Не удалось загрузить аналитику');
      const dataAnalytics = await resAnalytics.json();
      setAnalytics(dataAnalytics);

      const resProducts = await fetch(`${BASE_URL}/api/products?limit=2`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!resProducts.ok) throw new Error('Не удалось загрузить кампании');
      const dataProducts = await resProducts.json();
      setProducts(dataProducts);

      const resReviews = await fetch(`${BASE_URL}/api/reviews?limit=2`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!resReviews.ok) throw new Error('Не удалось загрузить отзывы');
      const dataReviews = await resReviews.json();
      setReviews(dataReviews);
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
      <h1>Панель рекламодателя</h1>
      <p>Обзор ваших кампаний и статистика</p>

      <div className="card-grid">
        <div className="card">
          <h3>Активные кампании</h3>
          <p>{analytics.active_campaigns}</p>
        </div>
        <div className="card">
          <h3>Отклики блогеров</h3>
          <p>{analytics.total_responses}</p>
        </div>
        <div className="card">
          <h3>Средняя оценка</h3>
          <p>{analytics.avg_rating} ⭐</p>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Мои товары</h2>
          <Link to="/advertiser/products" className="btn btn-outline">Все товары</Link>
        </div>
        <div className="card-grid">
          {products.map(product => (
            <div key={product.id} className="card">
              <h3>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                <span className={`status ${product.status.toLowerCase()}`}>
                  {product.status === 'pending' ? 'Ожидание' : product.status === 'in_work' ? 'В работе' : 'Завершена'}
                </span>
                <span style={{ fontWeight: 'bold' }}>{product.budget}</span>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Link to="/advertiser/products" className="btn btn-outline" style={{ width: '100%' }}>Подробнее</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Последние отзывы</h2>
          <Link to="/advertiser/reviews" className="btn btn-outline">Все отзывы</Link>
        </div>
        <div className="card-grid">
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{review.author}</h3>
                <div>{'⭐'.repeat(review.rating)}</div>
              </div>
              <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '10px 0' }}>
                {review.comment}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(review.date).toLocaleDateString()}</p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/advertiser/reviews" className="btn btn-outline" style={{ width: '100%' }}>Все отзывы</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}