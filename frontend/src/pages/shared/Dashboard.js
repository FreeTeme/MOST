// pages/shared/Dashboard.js
import React, { useState, useEffect } from "react";
import { dashboardConfigs } from "../../utils/roleConfigs";
import { getLimitedSocials, getLimitedReviews, getProducts } from "../../services/api"; // Изменили на getProducts
import { useNavigate } from "react-router-dom";

export default function Dashboard({ role, currentUser }) {
  const config = dashboardConfigs[role] || dashboardConfigs.blogger;
  const [socials, setSocials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]); // Добавили состояние для продуктов
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Загрузка социальных сетей для блогера
        if (config.sections.includes('socials') && currentUser?.id) {
          const socialsData = await getLimitedSocials(currentUser.id, 3);
          setSocials(socialsData.data || []);
        }

        // Загрузка отзывов
        if (config.sections.includes('reviews') && currentUser?.id) {
          const reviewsData = await getLimitedReviews(currentUser.id, 3);
          setReviews(reviewsData.data || []);
        }

        // Загрузка продуктов для рекламодателя - ИЗМЕНЕНИЕ ЗДЕСЬ
        if (role === 'advertiser' && currentUser?.id) {
          const productsData = await getProducts({ user_id: currentUser.id });
          setProducts(productsData.data?.slice(0, 3) || []); // Берем первые 3 продукта
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role, currentUser]);

  // Функции навигации с учетом роли
  const handleViewAll = (page) => {
    navigate(`/${role}/${page}`);
  };

  const handleAddEntity = (entityType) => {
    navigate(`/${role}/${entityType}/add`);
  };

  if (!currentUser) {
    return (
      <div className="dashboard">
        <h1>{config.title}</h1>
        <p className="subtitle">{config.subtitle}</p>
        <div className="empty-state">
          <p>Пожалуйста, войдите в систему чтобы увидеть данные</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h1>{config.title}</h1>
        <p className="subtitle">{config.subtitle}</p>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>{config.title}</h1>
      <p className="subtitle">{config.subtitle}</p>

      {/* Социальные сети для блогера */}
      {config.sections.includes('socials') && (
        <div className="section">
          <div className="section-header">
            <h2>Мои социальные сети</h2>
            <button 
              className="btn btn-outline"
              onClick={() => handleViewAll('socials')}
            >
              Посмотреть все
            </button>
          </div>
          {socials.length > 0 ? (
            <div className="card-grid">
              {socials.map((social) => (
                <div key={social.id} className="card social-card">
                  <h4>{social.platform}</h4>
                  <p>Подписчики: {social.followers?.toLocaleString()}</p>
                  <p>ER: {social.engagement}%</p>
                  <p>Цена: {social.price}₽</p>
                  {social.region && <p>Регион: {social.region}</p>}
                  {social.categories && social.categories.length > 0 && (
                    <p>Категории: {social.categories.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>У вас пока нет добавленных социальных сетей</p>
            </div>
          )}
        </div>
      )}

      {/* Продукты/кампании для рекламодателя - НОВАЯ СЕКЦИЯ */}
      {role === 'advertiser' && (
        <div className="section">
          <div className="section-header">
            <h2>Мои кампании</h2>
            <button 
              className="btn btn-outline"
              onClick={() => handleViewAll('products')}
            >
              Посмотреть все
            </button>
          </div>
          {products.length > 0 ? (
            <div className="card-grid">
              {products.map((product) => (
                <div key={product.id} className="card product-card">
                  <h4>{product.name}</h4>
                  <p>Бюджет: {product.budget}₽</p>
                  <p>Статус: {product.status}</p>
                  {product.brand && <p>Бренд: {product.brand}</p>}
                  {product.category && <p>Категория: {product.category}</p>}
                  {product.deadline && (
                    <p>Дедлайн: {new Date(product.deadline).toLocaleDateString()}</p>
                  )}
                  {product.applications_count !== undefined && (
                    <p>Заявки: {product.applications_count}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>У вас пока нет созданных кампаний</p>
            </div>
          )}
        </div>
      )}

      {/* Отзывы для блогера */}
      {config.sections.includes('reviews') && (
        <div className="section">
          <div className="section-header">
            <h2>Отзывы обо мне</h2>
            <button 
              className="btn btn-outline"
              onClick={() => handleViewAll('reviews')}
            >
              Посмотреть все
            </button>
          </div>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="card review-card">
                  <div className="review-header">
                    <span className="rating">{"⭐".repeat(review.rating)}</span>
                    <span className="date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">
                    {review.comment || 'Без комментария'}
                  </p>
                  <p className="review-author">— {review.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Пока нет отзывов</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}