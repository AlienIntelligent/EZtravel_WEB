import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../../store/authStore';
import UserLayout from '../../layouts/UserLayout';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error: authError } = useAuthStore();
    const [localError, setLocalError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setLocalError('');
        const result = await login(data.email, data.password);

        if (result.success) {
            const role = result.user.role || result.user.Role;
            if (role?.toString().toLowerCase() === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setLocalError(result.message);
        }
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

                                { (localError || authError) && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {localError || authError}
                                        <button type="button" className="close" onClick={() => setLocalError('')}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Nhập email"
                                            {...register('email')}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Mật khẩu</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Mật khẩu"
                                            {...register('password')}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
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
