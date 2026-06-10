import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../services/api";
import UserLayout from "../../components/UserLayout";

const Register = () => {
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(formData);
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

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      type="text"
                      name="hoTen"
                      className="form-control"
                      placeholder="Nhập họ tên"
                      value={formData.hoTen}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Nhập email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Xác nhận mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
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
