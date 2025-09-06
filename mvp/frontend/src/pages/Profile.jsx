import React, { useState } from "react";
import axios from "axios";

export default function Profile() {
  const [form, setForm] = useState({
    platform: "",
    profile_url: "",
    subscribers: "",
    er: "",
    category: "",
    price: "",
    content_example: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/bloggers/", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Анкета блогера сохранена");
    } catch (err) {
      alert("Ошибка при сохранении");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Мой профиль блогера</h2>
      <input placeholder="Платформа" name="platform" onChange={handleChange} /><br/>
      <input placeholder="Ссылка на профиль" name="profile_url" onChange={handleChange} /><br/>
      <input placeholder="Подписчики" name="subscribers" type="number" onChange={handleChange} /><br/>
      <input placeholder="ER" name="er" onChange={handleChange} /><br/>
      <input placeholder="Категория" name="category" onChange={handleChange} /><br/>
      <input placeholder="Цена" name="price" type="number" onChange={handleChange} /><br/>
      <input placeholder="Пример контента" name="content_example" onChange={handleChange} /><br/>
      <button onClick={handleSubmit}>Сохранить</button>
    </div>
  );
}
