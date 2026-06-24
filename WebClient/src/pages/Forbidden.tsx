import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden: React.FC = () => {
 return (
 <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
 <h1 className="display-1 fw-bold text-danger">403</h1>
 <h2 className="mb-4">Truy cập bị từ chối</h2>
 <p className="text-muted mb-4">
 Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
 </p>
 <Link to="/" className="btn btn-primary px-4 py-2">
 Quay lại Trang chủ
 </Link>
 </div>
 );
};

export default Forbidden;
