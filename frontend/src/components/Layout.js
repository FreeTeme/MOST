import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import BottomNav from "./BottomNav";

const Layout = ({ role = "blogger" }) => {
  return (
    <div className="app-shell">
      {/* боковое меню для ПК */}
      <aside className="side-nav" aria-hidden={false}>
        <SideNav role={role} />
      </aside>

      {/* основной контент */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* нижняя навигация для мобилки */}
      <nav className="bottom-nav" role="navigation" aria-label="Bottom navigation">
        <BottomNav role={role} />
      </nav>
    </div>
  );
};

export default Layout;
