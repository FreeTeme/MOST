import React, { useState, useEffect } from "react";
import { getAdminUsers } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminUsers().then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Пользователи</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}