import React from "react";

export default function AdminAnalytics() {
  return (
    <div>
      <h1>Аналитика системы</h1>
      <p>Статистика и аналитика работы платформы</p>

      <div className="card-grid">
        <div className="card">
          <h3>Регистрации</h3>
          <p>+24 за месяц</p>
          <div style={{ height: '100px', background: '#f0f0f0', marginTop: '10px', borderRadius: '8px' }}>
            {/* Здесь будет график */}
          </div>
        </div>
        <div className="card">
          <h3>Доход платформы</h3>
          <p>+15% за месяц</p>
          <div style={{ height: '100px', background: '#f0f0f0', marginTop: '10px', borderRadius: '8px' }}>
            {/* Здесь будет график */}
          </div>
        </div>
        <div className="card">
          <h3>Активность</h3>
          <p>256 действий в день</p>
          <div style={{ height: '100px', background: '#f0f0f0', marginTop: '10px', borderRadius: '8px' }}>
            {/* Здесь будет график */}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2>Детальная статистика</h2>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3>Распределение пользователей</h3>
              <ul>
                <li>Блогеры: 65%</li>
                <li>Рекламодатели: 35%</li>
              </ul>
            </div>
            <div>
              <h3>Статус кампаний</h3>
              <ul>
                <li>Активные: 42%</li>
                <li>Завершенные: 35%</li>
                <li>На рассмотрении: 23%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2>Топ кампаний</h2>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Кампания</th>
                <th>Рекламодатель</th>
                <th>Бюджет</th>
                <th>Охват</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Запуск нового продукта</td>
                <td>ООО Ромашка</td>
                <td>50,000 ₽</td>
                <td>125,000</td>
                <td>4.8%</td>
              </tr>
              <tr>
                <td>Продвижение бренда</td>
                <td>ИП Сидоров</td>
                <td>30,000 ₽</td>
                <td>85,000</td>
                <td>3.2%</td>
              </tr>
              <tr>
                <td>Сезонная акция</td>
                <td>ООО Лютик</td>
                <td>20,000 ₽</td>
                <td>45,000</td>
                <td>2.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}