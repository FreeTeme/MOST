import React, { useState, useEffect } from "react";
import { getReviews } from "../../services/api";

export default function BloggerReviews() {
  const [filter, setFilter] = useState(0);
  const [reviewsData, setReviewsData] = useState({ average: 0, reviews: [] });
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    getReviews().then(res => {
      setReviewsData(res.data);
      const dist = [0, 0, 0, 0, 0];
      res.data.reviews.forEach(r => dist[r.rating - 1]++);
      setRatingDistribution(dist);
    }).catch(console.error);
  }, []);

  const filteredReviews = filter > 0 
    ? reviewsData.reviews.filter(review => review.rating === filter)
    : reviewsData.reviews;

  return (
    <div>
      <h1>Отзывы</h1>
      <p>Аналитика и управление отзывами</p>

      <div className="card-grid">
        <div className="card">
          <h3>Средний рейтинг</h3>
          <p>{reviewsData.average} ⭐</p>
        </div>
        {ratingDistribution.map((count, index) => (
          <div key={index} className="card">
            <h3>{index + 1} ⭐</h3>
            <p>{count} отзывов</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2>Все отзывы</h2>
        <select 
          className="input"
          value={filter} 
          onChange={(e) => setFilter(Number(e.target.value))}
          style={{ width: '200px', marginBottom: '16px' }}
        >
          <option value={0}>Все оценки</option>
          <option value={5}>5 звезд</option>
          <option value={4}>4 звезды</option>
          <option value={3}>3 звезды</option>
          <option value={2}>2 звезды</option>
          <option value={1}>1 звезда</option>
        </select>

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
                <td>{review.author}</td>
                <td>{'⭐'.repeat(review.rating)}</td>
                <td>{review.comment}</td>
                <td>{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}