import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "../../api";
import UserLayout from "../../layouts/UserLayout";

const registerSchema = z.object({
  hoTen: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.register(data);
      if (response.data) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
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
              <h1 className="mb-3 bread">Đăng Ký</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section ftco-degree-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 ftco-animate">
              <div className="card p-5 shadow">
                <h3 className="text-center mb-4">Đăng Ký Tài Khoản</h3>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="close" onClick={() => setError("")}>
                      &times;
                    </button>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    Đăng ký thành công! Đang chuyển hướng...
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      type="text"
                      className={`form-control ${errors.hoTen ? 'is-invalid' : ''}`}
                      placeholder="Nhập họ tên"
                      {...register("hoTen")}
                    />
                    {errors.hoTen && <div className="invalid-feedback">{errors.hoTen.message}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Nhập email"
                      {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Mật khẩu"
                      {...register("password")}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Xác nhận mật khẩu"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 px-5 btn-block"
                    disabled={loading || success}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm mr-2"></span> : null}
                    Đăng Ký
                  </button>
                </form>

                <p className="text-center mt-4">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
};

export default Register;
