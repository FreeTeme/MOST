import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart } from "lucide-react";

const navItems = {
  blogger: [
    { to: "/blogger", icon: <Home size={20} />, label: "Главная" },
    { to: "/blogger/catalog", icon: <Search size={20} />, label: "Каталог" },
    { to: "/blogger/swipe", icon: <Heart size={20} />, label: "Свайп" },
  ],
  advertiser: [
    { to: "/advertiser", icon: <Home size={20} />, label: "Главная" },
    { to: "/advertiser/catalog", icon: <Search size={20} />, label: "Каталог" },
    { to: "/advertiser/swipe", icon: <Heart size={20} />, label: "Свайп" },
  ],
  admin: [
    { to: "/admin", icon: <Home size={20} />, label: "Главная" },
    { to: "/admin/users", icon: <Search size={20} />, label: "Пользователи" },
    { to: "/admin/campaigns", icon: <Heart size={20} />, label: "Кампании" },
  ],
};

export default function BottomNav() {
  const location = useLocation();
  
  const currentRole = location.pathname.startsWith("/admin") ? "admin" : 
                     location.pathname.startsWith("/advertiser") ? "advertiser" : "blogger";
  
  const items = navItems[currentRole] || navItems.blogger;

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-item ${active ? "active" : ""}`}
          >
            <div className="icon">{item.icon}</div>
            <div className="label">{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}