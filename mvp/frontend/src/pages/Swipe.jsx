import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import axios from "axios";

export default function Swipe() {
  const [bloggers, setBloggers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bloggers/")
      .then(res => setBloggers(res.data));
  }, []);

  const swiped = (direction, blogger) => {
    if (direction === "right") {
      alert(`Добавлен в кампанию: ${blogger.profile_url}`);
      // тут можно отправить запрос в API для добавления в кампанию
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Свайпы</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {bloggers.map(b => (
          <TinderCard
            key={b.id}
            onSwipe={(dir) => swiped(dir, b)}
            preventSwipe={["up", "down"]}
          >
            <div style={{
              background: "#fff",
              width: "300px",
              height: "400px",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              marginBottom: "20px"
            }}>
              <h3>{b.profile_url}</h3>
              <p>{b.platform}</p>
              <p>{b.subscribers} подписчиков</p>
              <p>{b.price} ₽</p>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}
