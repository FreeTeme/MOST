import React, { useState, useEffect } from "react";

export default function AdvertiserReviews() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState(0);
  const [averageRating, setAverageRating] = useState(0.0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить отзывы');
      const data = await res.json();
      setReviews(data);

      const total = data.length;
      const avg = total > 0 ? (data.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0.0;
      setAverageRating(avg);

      const dist = [0, 0, 0, 0, 0];
      data.forEach(r => dist[r.rating - 1]++);
      setRatingDistribution(dist);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = filter > 0 ? reviews.filter(review => review.rating === filter) : reviews;

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
      <h1>Отзывы</h1>
      <p>Отзывы блогеров о сотрудничестве с вами</p>

      <div className="card-grid">
        <div className="card">
          <h3>Средний рейтинг</h3>
          <p>{averageRating} ⭐</p>
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
                <td>{new Date(review.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}