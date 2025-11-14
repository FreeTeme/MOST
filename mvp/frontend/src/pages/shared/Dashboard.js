// pages/shared/Dashboard.js
import React, { useState, useEffect } from "react";
import { dashboardConfigs } from "../../utils/roleConfigs";
import { getLimitedSocials, getLimitedReviews, getCatalogProducts, getProfileStats } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ role, currentUser }) {
  const config = dashboardConfigs[role] || dashboardConfigs.blogger;
  const [stats, setStats] = useState({});
  const [socials, setSocials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log('Dashboard props:', { role, currentUser }); // Отладочная информация

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        console.log('Starting to fetch dashboard data...'); // Отладочная информация
        
        // Загрузка статистики (должна работать даже без currentUser)
        const statPromises = config.stats.map(async (stat) => {
          try {
            const value = await stat.fetch();
            console.log(`Stat ${stat.key}:`, value); // Отладочная информация
            return { [stat.key]: value };
          } catch (error) {
            console.error(`Error fetching stat ${stat.key}:`, error);
            return { [stat.key]: 0 };
          }
        });
        
        const statResults = await Promise.all(statPromises);
        setStats(Object.assign({}, ...statResults));

        // Загрузка дополнительных данных в зависимости от роли и секций
        if (config.sections.includes('socials') && currentUser?.id) {
          console.log('Fetching socials for user:', currentUser.id);
          const socialsData = await getLimitedSocials(currentUser.id, 3);
          setSocials(socialsData.data || []);
        } else if (config.sections.includes('socials')) {
          console.log('No user ID for socials');
          setSocials([]);
        }

        if (config.sections.includes('reviews') && currentUser?.id) {
          console.log('Fetching reviews for user:', currentUser.id);
          const reviewsData = await getLimitedReviews(currentUser.id, 3);
          setReviews(reviewsData.data || []);
        } else if (config.sections.includes('reviews')) {
          console.log('No user ID for reviews');
          setReviews([]);
        }

        if (config.sections.includes('products') && currentUser?.id) {
          console.log('Fetching products for user:', currentUser.id);
          const productsData = await getCatalogProducts({ 
            advertiser_id: currentUser.id, 
            limit: 3 
          });
          setProducts(productsData.data || []);
        } else if (config.sections.includes('products')) {
          console.log('No user ID for products');
          setProducts([]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
        console.log('Dashboard loading finished'); // Отладочная информация
      }
    };

    fetchDashboardData();
  }, [role, currentUser]);

  const handleViewAll = (page) => {
    navigate(`/${page}`);
  };

  // Если currentUser не передан, показываем сообщение
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

      {/* Статистика */}
      <div className="card-grid">
        {config.stats.map(({ key, label, suffix = '' }) => (
          <div key={key} className="card stat-card">
            <h3>{label}</h3>
            <p className="stat-value">{(stats[key] || 0).toLocaleString()}{suffix}</p>
          </div>
        ))}
      </div>

      {/* Остальной код остается без изменений */}
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
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/socials/add')}
              >
                Добавить социальную сеть
              </button>
            </div>
          )}
        </div>
      )}

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

      {config.sections.includes('products') && (
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
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>У вас пока нет созданных кампаний</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/products/add')}
              >
                Создать кампанию
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}