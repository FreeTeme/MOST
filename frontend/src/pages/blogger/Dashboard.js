import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSocials, getReviews } from "../../services/api";

export default function BloggerDashboard() {
  const [socials, setSocials] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getSocials({ limit: 2 }).then(res => setSocials(res.data)).catch(console.error);
    getReviews().then(res => setReviews(res.data.reviews.slice(0, 2))).catch(console.error);
  }, []);

  const averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;
  const totalFollowers = socials.reduce((sum, social) => sum + social.followers, 0);
  const averageER = socials.length ? (socials.reduce((sum, social) => sum + social.engagement, 0) / socials.length).toFixed(1) : 0;

  return (
    <div>
      <h1>Панель блогера</h1>
      <p>Обзор вашей активности и статистика</p>

      <div className="card-grid">
        <div className="card">
          <h3>Подписчики</h3>
          <p>{totalFollowers.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Средний ER</h3>
          <p>{averageER}%</p>
        </div>
        <div className="card">
          <h3>Показы карточки</h3>
          <p>1,245</p>  {/* Fetch if needed */}
        </div>
        <div className="card">
          <h3>Средняя оценка</h3>
          <p>{averageRating} ⭐</p>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Социальные сети</h2>
          <Link to="/blogger/socials" className="btn btn-outline">
            Все соцсети
          </Link>
        </div>

        <div className="card-grid">
          {socials.map(social => (
            <div key={social.id} className="card">
              <h3>{social.platform}</h3>
              <p>Подписчики: {social.followers.toLocaleString()}</p>
              <p>ER: {social.engagement}%</p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/blogger/socials" className="btn btn-outline" style={{ width: '100%' }}>
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>

        {socials.length > 2 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/blogger/socials" style={{ color: '#6366f1', textDecoration: 'none' }}>
              Показать все {socials.length} соцсети →
            </Link>
          </div>
        )}
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Последние отзывы</h2>
          <Link to="/blogger/reviews" className="btn btn-outline">
            Все отзывы
          </Link>
        </div>

        <div className="card-grid">
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{review.author}</h3>
                <div>{'⭐'.repeat(review.rating)}</div>
              </div>
              <p style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: '10px 0'
              }}>
                {review.comment}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{review.date}</p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/blogger/reviews" className="btn btn-outline" style={{ width: '100%' }}>
                  Все отзывы
                </Link>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 2 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/blogger/reviews" style={{ color: '#6366f1', textDecoration: 'none' }}>
              Показать все {reviews.length} отзыва →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}