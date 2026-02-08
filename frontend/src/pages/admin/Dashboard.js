import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Панель администратора</h1>
      <p>Общая статистика и управление системой</p>

      <div className="card-grid">
        <div className="card">
          <h3>Всего пользователей</h3>
          <p>256</p>
        </div>
        <div className="card">
          <h3>Активных кампаний</h3>
          <p>42</p>
        </div>
        <div className="card">
          <h3>Новых отзывов</h3>
          <p>18</p>
        </div>
        <div className="card">
          <h3>Доход системы</h3>
          <p>125,430 ₽</p>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2>Недавняя активность</h2>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Действие</th>
                <th>Время</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Анна Иванова</td>
                <td>Создала новую кампанию</td>
                <td>10 минут назад</td>
              </tr>
              <tr>
                <td>Петр Сидоров</td>
                <td>Добавил отзыв</td>
                <td>30 минут назад</td>
              </tr>
              <tr>
                <td>Мария Петрова</td>
                <td>Зарегистрировалась как блогер</td>
                <td>1 час назад</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}