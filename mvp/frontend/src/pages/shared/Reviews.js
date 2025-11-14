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

  useEffect(() => {
    const fetchReviewsData = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          // Загружаем статистику отзывов
          const statsResponse = await getReviewsStats(currentUser.id);
          const statsData = statsResponse.data;
          
          // Загружаем список отзывов
          const reviewsResponse = await getReviews({ user_id: currentUser.id });
          const reviewsList = reviewsResponse.data || [];

          setReviewsData({
            average: statsData.average || 0,
            total_reviews: statsData.total_reviews || 0,
            rating_distribution: statsData.rating_distribution || [0, 0, 0, 0, 0],
            reviews: reviewsList
          });
        }
      } catch (error) {
        console.error('Error fetching reviews data:', error);
        // В случае ошибки используем пустые данные
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
  }, [role, currentUser]);

  const filteredReviews = filter > 0
    ? reviewsData.reviews.filter(review => review.rating === filter)
    : reviewsData.reviews;

  if (loading) {
    return (
      <div>
        <h1>Отзывы</h1>
        <p>{subtitle}</p>
        <div className="loading">Загрузка отзывов...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <h1>Отзывы</h1>
        <p>{subtitle}</p>
        <div className="empty-state">
          <p>Пожалуйста, войдите в систему чтобы увидеть отзывы</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Отзывы</h1>
      <p>{subtitle}</p>

      {/* Статистика */}
      <div className="card-grid">
        <div className="card stat-card">
          <h3>Средний рейтинг</h3>
          <p className="stat-value">{reviewsData.average} ⭐</p>
          <p className="stat-subtitle">на основе {reviewsData.total_reviews} отзывов</p>
        </div>
        
        {reviewsData.rating_distribution.map((count, index) => (
          <div key={index} className="card stat-card">
            <h3>{index + 1} ⭐</h3>
            <p className="stat-value">{count}</p>
            <p className="stat-subtitle">отзывов</p>
          </div>
        ))}
      </div>

      {/* Список отзывов */}
      <div style={{ marginTop: '32px' }}>
        <div className="section-header">
          <h2>Все отзывы ({filteredReviews.length})</h2>
          
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(Number(e.target.value))}
            style={{ width: '200px' }}
          >
            <option value={0}>Все оценки</option>
            <option value={5}>5 звезд</option>
            <option value={4}>4 звезды</option>
            <option value={3}>3 звезды</option>
            <option value={2}>2 звезды</option>
            <option value={1}>1 звезда</option>
          </select>
        </div>

        {filteredReviews.length > 0 ? (
          <div className="reviews-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Автор</th>
                  <th>Оценка</th>
                  <th>Комментарий</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map(review => (
                  <tr key={review.id}>
                    <td>
                      <strong>{review.author}</strong>
                    </td>
                    <td>
                      <span className="rating-stars">
                        {'⭐'.repeat(review.rating)}
                        <span className="rating-number">({review.rating})</span>
                      </span>
                    </td>
                    <td className="comment-cell">
                      {review.comment || <em>Без комментария</em>}
                    </td>
                    <td>
                      {new Date(review.date).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            {filter > 0 ? (
              <p>Нет отзывов с выбранной оценкой</p>
            ) : (
              <p>Пока нет отзывов</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}