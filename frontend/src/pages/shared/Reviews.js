// pages/shared/Reviews.js
import React, { useState, useEffect } from "react";
import { getReviews, getReviewsStats } from "../../services/api";

export default function Reviews({ role, currentUser }) {
  const [filter, setFilter] = useState(0);
  const [reviewsData, setReviewsData] = useState({ 
    average: 0, 
    reviews: [], 
    total_reviews: 0,
    rating_distribution: [0, 0, 0, 0, 0] 
  });
  const [loading, setLoading] = useState(true);

  const isBlogger = role === 'blogger';
  const subtitle = isBlogger 
    ? 'Аналитика и управление отзывами' 
    : 'Отзывы блогеров о сотрудничестве с вами';

  // Загрузка данных об отзывах
  useEffect(() => {
    const fetchReviewsData = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          // Загружаем статистику отзывов
          const statsResponse = await getReviewsStats(currentUser.id);
          const statsData = statsResponse.data;
          
          // Загружаем список отзывов с фильтрацией по пользователю
          const reviewsResponse = await getReviews({ user_id: currentUser.id });
          const reviewsList = reviewsResponse.data?.reviews || reviewsResponse.data || [];

          setReviewsData({
            average: statsData.average || 0,
            total_reviews: statsData.total_reviews || 0,
            rating_distribution: statsData.rating_distribution || [0, 0, 0, 0, 0],
            reviews: reviewsList
          });
        }
      } catch (error) {
        console.error('Error fetching reviews data:', error);
        setReviewsData({
          average: 0,
          reviews: [],
          total_reviews: 0,
          rating_distribution: [0, 0, 0, 0, 0]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, [currentUser]);

  // Фильтрация отзывов по рейтингу
  const filteredReviews = filter > 0
    ? reviewsData.reviews.filter(review => review.rating === filter)
    : reviewsData.reviews;

  // Функция для отображения звезд рейтинга
  const renderRatingStars = (rating) => {
    return (
      <span className="rating-stars">
        {'⭐'.repeat(rating)}
        <span style={{marginLeft: '8px', color: '#666'}}>({rating})</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <h1>Отзывы</h1>
        <p>{subtitle}</p>
        <div className="loading">Загрузка отзывов...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="reviews-page">
        <h1>Отзывы</h1>
        <p>{subtitle}</p>
        <div className="empty-state">
          <p>Пожалуйста, войдите в систему чтобы увидеть отзывы</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1>Отзывы</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {/* Статистика отзывов */}
      <div className="stats-section">
        <h2>Статистика отзывов</h2>
        <div className="card-grid">
          <div className="card stat-card">
            <h3>Средний рейтинг</h3>
            <p className="stat-value">{reviewsData.average.toFixed(1)}</p>
            <p className="stat-subtitle">на основе {reviewsData.total_reviews} отзывов</p>
          </div>
          
          {/* Распределение по рейтингам */}
          {reviewsData.rating_distribution.map((count, index) => (
            <div 
              key={index} 
              className={`card stat-card ${filter === index + 1 ? 'active' : ''}`}
              onClick={() => setFilter(filter === index + 1 ? 0 : index + 1)}
              style={{cursor: 'pointer'}}
            >
              <h3>{index + 1} ⭐</h3>
              <p className="stat-value">{count}</p>
              <p className="stat-subtitle">отзывов</p>
              {filter === index + 1 && <div className="active-indicator">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Фильтры и список отзывов */}
      <div className="reviews-list-section">
        <div className="section-header">
          <div className="section-title">
            <h2>Все отзывы</h2>
            <span className="badge">{filteredReviews.length}</span>
          </div>
          
          <div className="filters">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(Number(e.target.value))}
            >
              <option value={0}>Все оценки</option>
              <option value={5}>5 звезд</option>
              <option value={4}>4 звезды</option>
              <option value={3}>3 звезды</option>
              <option value={2}>2 звезды</option>
              <option value={1}>1 звезда</option>
            </select>
            
            {filter > 0 && (
              <button 
                className="btn btn-outline"
                onClick={() => setFilter(0)}
              >
                Сбросить фильтр
              </button>
            )}
          </div>
        </div>

        {/* Список отзывов */}
        {filteredReviews.length > 0 ? (
          <div className="reviews-container">
            {filteredReviews.map(review => (
              <div key={review.id} className="review-card card">
                <div className="review-header">
                  <div className="review-author">
                    <strong>{review.author}</strong>
                  </div>
                  <div className="review-rating">
                    {renderRatingStars(review.rating)}
                  </div>
                </div>
                
                <div className="review-content">
                  <p className="review-comment">
                    {review.comment || <em className="text-muted">Без комментария</em>}
                  </p>
                </div>
                
                <div className="review-footer">
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {filter > 0 ? (
              <div>
                <p>Нет отзывов с оценкой {filter} ⭐</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setFilter(0)}
                >
                  Показать все отзывы
                </button>
              </div>
            ) : (
              <p>Пока нет отзывов. Отзывы появятся после сотрудничества с другими пользователями.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}