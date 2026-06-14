import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../assets/css/admin-custom.css";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();

  useEffect(() => {
    // Add AdminLTE CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css";
    link.id = "adminlte-css";
    document.head.appendChild(link);

    // Add FontAwesome
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    fa.id = "fa-css";
    document.head.appendChild(fa);
    
    // Add AdminLTE JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js";
    script.id = "adminlte-js";
    document.body.appendChild(script);

    // Add layout class to body
    document.body.classList.add('sidebar-mini');
    
    return () => {
      // Remove AdminLTE CSS & JS
      const existingLink = document.getElementById("adminlte-css");
      if (existingLink) document.head.removeChild(existingLink);
      
      const existingScript = document.getElementById("adminlte-js");
      if (existingScript) document.body.removeChild(existingScript);

      const existingFa = document.getElementById("fa-css");
      if (existingFa) document.head.removeChild(existingFa);
      
      document.body.classList.remove('sidebar-mini');
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link text-primary font-weight-bold">
              <i className="fas fa-external-link-alt mr-1"></i> Xem Website
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-user"></i> {user?.name || user?.username || 'User'}
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                {user?.email || 'No email'}
              </span>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/dashboard" className="brand-link">
          <span className="brand-text font-weight-light ml-3">
            <b>ezTravel.</b> Admin
          </span>
        </Link>

        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
            >
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard")}`}
                >
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Tổng quan</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/products"
                  className={`nav-link ${isActive("/products")}`}
                >
                  <i className="nav-icon fas fa-map-marker-alt"></i>
                  <p>Địa điểm</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/categories"
                  className={`nav-link ${isActive("/categories")}`}
                >
                  <i className="nav-icon fas fa-tags"></i>
                  <p>Danh mục</p>
                </Link>
              </li>
              {isAdmin() && (
                <li className="nav-item">
                  <Link
                    to="/users"
                    className={`nav-link ${isActive("/users")}`}
                  >
                    <i className="nav-icon fas fa-users"></i>
                    <p>Người dùng</p>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      {children}

      {/* Footer */}
      <footer className="main-footer">
        <strong>
          Copyright &copy; 2026 <a href="#">ezTravel</a>.
        </strong>
        <div className="float-right d-none d-sm-inline-block">
          <b>Phiên bản</b> 1.0.0
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
