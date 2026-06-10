import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserLayout from '../../components/UserLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <UserLayout>
            <div
                className="hero-wrap js-fullheight"
                style={{ backgroundImage: 'url("/images/bg_2.jpg")', minHeight: '60vh' }}
            >
                <div className="overlay"></div>
                <div className="container">
                    <div
                        className="row no-gutters slider-text js-fullheight align-items-center justify-content-center"
                        style={{ minHeight: '60vh' }}
                    >
                        <div className="col-md-9 ftco-animate text-center">
                            <h1 className="mb-3 bread">Đăng Nhập</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 ftco-animate">
                            <div className="card p-5 shadow">
                                <h3 className="text-center mb-4">Đăng Nhập EZtravel</h3>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="close" onClick={() => setError('')}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Nhập email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mật khẩu</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group text-right">
                                        <a href="#">Quên mật khẩu?</a>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary py-3 px-5 btn-block"
                                        disabled={loading}
                                    >
                                        {loading ? <span className="spinner-border spinner-border-sm mr-2"></span> : null}
                                        Đăng Nhập
                                    </button>
                                </form>

                                <p className="text-center mt-4">
                                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
};

export default Login;
