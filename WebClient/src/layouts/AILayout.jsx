import { Outlet, Link, useLocation } from 'react-router-dom';

function AILayout() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/ai/planner"><i className="fas fa-robot me-2"></i>ezTravel AI</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#aiNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="aiNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname.includes('/ai/planner') ? 'active fw-bold' : ''}`} to="/ai/planner">
                                <i className="fas fa-magic me-1"></i> Tạo Lịch Trình
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname.includes('/ai/assistant') ? 'active fw-bold' : ''}`} to="/ai/assistant">
                                <i className="fas fa-comments me-1"></i> Trợ lý Ảo
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname.includes('/ai/history') ? 'active fw-bold' : ''}`} to="/ai/history">
                                <i className="fas fa-history me-1"></i> Lịch sử AI
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <Link to="/planner" className="btn btn-light btn-sm fw-bold text-primary">
                            <i className="fas fa-arrow-left me-2"></i> Quay lại Workspace
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
        <main className="flex-grow-1 overflow-auto">
            <Outlet />
        </main>
    </div>);

}

export default AILayout;