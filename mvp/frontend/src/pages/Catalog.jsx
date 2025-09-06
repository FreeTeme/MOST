import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Catalog() {
  const [bloggers, setBloggers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bloggers/")
      .then(res => setBloggers(res.data))
      .catch(() => alert("Ошибка загрузки блогеров"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Каталог блогеров</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
        {bloggers.map(b => (
          <div key={b.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <h3>{b.profile_url}</h3>
            <p>Платформа: {b.platform}</p>
            <p>Подписчики: {b.subscribers}</p>
            <p>ER: {b.er}</p>
            <p>Категория: {b.category}</p>
            <p>Цена: {b.price} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
}
