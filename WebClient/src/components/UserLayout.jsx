import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserLayout = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Re-initialize animations and jQuery plugins
        if (window.initEzTravelUI) {
            // Give React a moment to render the new components
            setTimeout(() => {
                window.initEzTravelUI();
                
                // Refresh AOS animations
                if (window.AOS) {
                    window.AOS.refresh();
                }
            }, 100);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">EZtravel.</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu"></span> Menu
                    </button>

                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item"><Link to="/" className="nav-link">Trang chủ</Link></li>
                            <li className="nav-item"><Link to="/tours" className="nav-link">Lộ Trình Tự Túc</Link></li>
                            <li className="nav-item"><Link to="/tours" className="nav-link">Điểm Đến</Link></li>
                            <li className="nav-item"><Link to="/hotels" className="nav-link">Nơi Ở</Link></li>
                            <li className="nav-item"><Link to="/blog" className="nav-link">Kinh Nghiệm</Link></li>
                            <li className="nav-item"><Link to="/about" className="nav-link">Về Chúng Tôi</Link></li>
                            <li className="nav-item"><Link to="/contact" className="nav-link">Liên Hệ</Link></li>
                            
                            {isAuthenticated ? (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Hi, {user?.name || user?.username}
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link>
                                        <Link className="dropdown-item" to="/my-bookings">Đơn đặt chỗ</Link>
                                        {user?.role === 'Admin' && (
                                            <Link className="dropdown-item" to="/dashboard">Trang Admin</Link>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
                                    </div>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item"><Link to="/register" className="nav-link">Đăng Ký</Link></li>
                                    <li className="nav-item cta"><Link to="/login" className="nav-link">Đăng Nhập</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {children}

            <footer className="ftco-footer ftco-bg-dark ftco-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">EZtravel</h2>
                                <p>Khám phá Việt Nam theo cách của bạn. Lộ trình chi tiết, homestay đẹp và trải nghiệm thực tế.</p>
                                <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                                    <li className="ftco-animate"><a href="#"><span className="icon-twitter"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-facebook"></span></a></li>
                                    <li className="ftco-animate"><a href="#"><span className="icon-instagram"></span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4 ml-md-5">
                                <h2 className="ftco-heading-2">Thông tin</h2>
                                <ul className="list-unstyled">
                                    <li><Link to="/about" className="py-2 d-block">Về chúng tôi</Link></li>
                                    <li><a href="#" className="py-2 d-block">Dịch vụ</a></li>
                                    <li><a href="#" className="py-2 d-block">Điều khoản</a></li>
                                    <li><a href="#" className="py-2 d-block">Chính sách bảo mật</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Hỗ trợ</h2>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="py-2 d-block">FAQ</a></li>
                                    <li><a href="#" className="py-2 d-block">Thanh toán</a></li>
                                    <li><a href="#" className="py-2 d-block">Cẩm nang đặt chỗ</a></li>
                                    <li><Link to="/contact" className="py-2 d-block">Liên hệ</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="ftco-footer-widget mb-4">
                                <h2 className="ftco-heading-2">Liên hệ</h2>
                                <div className="block-23 mb-3">
                                    <ul>
                                        <li><span className="icon icon-map-marker"></span><span className="text">Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span></li>
                                        <li><a href="#"><span className="icon icon-phone"></span><span className="text">+84 123 456 789</span></a></li>
                                        <li><a href="#"><span className="icon icon-envelope"></span><span className="text">info@eztravel.com</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <p>
                                Copyright &copy; {new Date().getFullYear()} ezTravel. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;
