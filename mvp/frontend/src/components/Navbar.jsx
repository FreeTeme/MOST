import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/catalog" style={{ margin: "10px" }}>Каталог</Link>
      <Link to="/swipe" style={{ margin: "10px" }}>Свайпы</Link>
      <Link to="/profile" style={{ margin: "10px" }}>Профиль</Link>
      <Link to="/campaigns" style={{ margin: "10px" }}>Кампании</Link>
    </nav>
  );
}

