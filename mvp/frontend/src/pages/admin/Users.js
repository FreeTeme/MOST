import React, { useState } from "react";

const mockUsers = [
  { id: 1, name: "Анна Иванова", email: "anna@example.com", role: "blogger", status: "active", registration: "2023-03-15" },
  { id: 2, name: "Петр Сидоров", email: "peter@example.com", role: "advertiser", status: "active", registration: "2023-04-10" },
  { id: 3, name: "Мария Петрова", email: "maria@example.com", role: "blogger", status: "pending", registration: "2023-04-20" }
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState("all");

  const filteredUsers = filter === "all" 
    ? users 
    : users.filter(user => user.role === filter || user.status === filter);

  const changeUserStatus = (id, newStatus) => {
    setUsers(users.map(user => 
      user.id === id ? {...user, status: newStatus} : user
    ));
  };

  return (
    <div>
      <h1>Управление пользователями</h1>
      <p>Просмотр и редактирование пользователей системы</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select 
          className="input"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="all">Все пользователи</option>
          <option value="blogger">Блогеры</option>
          <option value="advertiser">Рекламодатели</option>
          <option value="active">Активные</option>
          <option value="pending">На рассмотрении</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Регистрация</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === "blogger" ? "Блогер" : "Рекламодатель"}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status === "active" ? "Активен" : "На рассмотрении"}
                  </span>
                </td>
                <td>{user.registration}</td>
                <td>
                  {user.status === "pending" && (
                    <button 
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => changeUserStatus(user.id, "active")}
                    >
                      Одобрить
                    </button>
                  )}
                  <button 
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '5px' }}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}