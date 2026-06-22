import { useState  } from "react";
import { Outlet, Link, useLocation } from 'react-router-dom';




















function BaseDashboardLayout({
  brandName,
  menuItems,
  user,
  onLogout,
  sidebarBg = 'bg-white',
  sidebarText = 'text-dark',
  activeBg = 'bg-primary'
}) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Manage collapsible sub-menus
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const isActive = (path) => location.pathname === path || location.pathname.endsWith(path);
  const isChildActive = (children) => children?.some((c) => location.pathname.includes(c.path));

  return (
    <div className="d-flex vh-100 bg-light" style={{ overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
        className={`${sidebarBg} border-end shadow-sm d-flex flex-column transition-all`}
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.3s ease'
        }}>
        
            {/* Brand */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-center" style={{ height: '60px' }}>
                {brandName}
            </div>

            {/* Navigation */}
            <nav className="p-3 flex-grow-1">
                <ul className="nav flex-column gap-1">
                    {menuItems.map((item) => {
              const isGroupActive = isChildActive(item.children);

              if (item.children) {
                const isOpen = openMenus[item.key] || isGroupActive;
                return (
                  <li key={item.key} className="nav-item mb-1">
                                    <a
                      href="#"
                      className={`nav-link rounded ${sidebarText} d-flex justify-content-between align-items-center ${isGroupActive ? 'fw-bold' : ''}`}
                      onClick={(e) => {e.preventDefault();toggleMenu(item.key);}}>
                      
                                        <div><i className={`${item.icon} me-2`} style={{ width: '20px' }}></i> {item.label}</div>
                                        <i className={`fas fa-chevron-${isOpen ? 'down' : 'right'} small`}></i>
                                    </a>
                                    {isOpen &&
                    <ul className="nav flex-column ms-3 mt-1 border-start ps-2">
                                            {item.children.map((child) =>
                      <li key={child.path} className="nav-item mb-1">
                                                    <Link
                          to={child.path}
                          className={`nav-link rounded py-1 small ${isActive(child.path) ? `${activeBg} text-white` : sidebarText}`}>
                          
                                                        {child.label}
                                                    </Link>
                                                </li>
                      )}
                                        </ul>
                    }
                                </li>);

              }

              return (
                <li key={item.key} className="nav-item mb-1">
                                <Link
                    to={item.path}
                    className={`nav-link rounded ${isActive(item.path) ? `${activeBg} text-white` : sidebarText}`}>
                    
                                    <i className={`${item.icon} me-2`} style={{ width: '20px' }}></i> {item.label}
                                </Link>
                            </li>);

            })}
                </ul>
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex flex-column h-100" style={{ minWidth: 0 }}>
            {/* Navbar */}
            <header className="bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-4" style={{ height: '60px', zIndex: 10 }}>
                <div className="d-flex align-items-center">
                    <button className="btn btn-light border-0 me-3" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="btn btn-outline-primary btn-sm">
                        <i className="fas fa-external-link-alt me-1"></i> Xem Website
                    </Link>
                </div>

                <div className="position-relative">
                    <button className="btn btn-light border-0 d-flex align-items-center" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <span className="fw-bold">{user?.fullName || 'Nhà cung cấp'}</span>
                    </button>

                    {isUserMenuOpen &&
            <div className="position-absolute bg-white border shadow-sm rounded p-2 mt-1 end-0" style={{ width: '200px' }}>
                            <div className="px-3 py-2 border-bottom mb-2 text-muted small">{user?.email || 'user@eztravel.com'}</div>
                            <button className="dropdown-item text-danger w-100 text-start" onClick={onLogout}>
                                <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                            </button>
                        </div>
            }
                </div>
            </header>

            {/* Page Content */}
            <div className="flex-grow-1 overflow-auto p-4 bg-light">
                <Outlet />
            </div>
        </main>
    </div>);

}

export default BaseDashboardLayout;