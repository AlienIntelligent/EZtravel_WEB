import { useState } from "react";
import { useAppSelector } from '../../store/hooks';

function ProviderProfile() {
 const user = useAppSelector((state) => state.auth.user);

 // In a real implementation, we would have a GET /provider/profile and PUT /provider/profile endpoint.
 // For now, we mock the local state using the auth user data.
 const [name, setName] = useState(user?.fullName || 'Công ty TNHH ezTravel NCC');
 const [email, setEmail] = useState(user?.email || 'provider@eztravel.com');
 const [phone, setPhone] = useState('0901234567');
 const [address, setAddress] = useState('123 Đường Hải Phòng, Quận Hải Châu, Đà Nẵng');
 const [description, setDescription] = useState('Chúng tôi là nhà cung cấp các dịch vụ lưu trú và tour du lịch uy tín hàng đầu tại Đà Nẵng.');

 const handleSubmit = (e) => {
 e.preventDefault();
 alert('Cập nhật hồ sơ thành công!');
 };

 return (
 <div className="container-fluid max-w-4xl mx-auto" style={{ maxWidth: '800px' }}>
 <div className="d-flex justify-content-between align-items-center mb-4">
 <h3 className="m-0 font-weight-bold">Hồ sơ Nhà cung cấp</h3>
 </div>

 <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
 <div className="card-body p-4">
 <form onSubmit={handleSubmit}>
 <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
 <div className="position-relative">
 <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
 {name.charAt(0)}
 </div>
 <button type="button" className="btn btn-sm btn-light position-absolute bottom-0 end-0 border rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }}>
 <i className="fas fa-camera"></i>
 </button>
 </div>
 <div className="ms-3">
 <h5 className="mb-1 fw-bold">{name}</h5>
 <p className="text-muted mb-0 small">ID: PRV-{user?.id || '987654'}</p>
 </div>
 </div>

 <div className="row mb-3">
 <div className="col-md-6">
 <label className="form-label fw-bold">Tên doanh nghiệp <span className="text-danger">*</span></label>
 <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
 </div>
 <div className="col-md-6">
 <label className="form-label fw-bold">Email liên hệ <span className="text-danger">*</span></label>
 <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
 </div>
 </div>

 <div className="row mb-3">
 <div className="col-md-6">
 <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
 <input type="tel" className="form-control" required value={phone} onChange={(e) => setPhone(e.target.value)} />
 </div>
 <div className="col-md-6">
 <label className="form-label fw-bold">Trạng thái xác thực</label>
 <div>
 <span className="badge bg-success bg-opacity-10 text-success border border-success p-2">
 <i className="fas fa-check-circle me-1"></i> Đã xác minh KYC
 </span>
 </div>
 </div>
 </div>

 <div className="mb-3">
 <label className="form-label fw-bold">Địa chỉ trụ sở</label>
 <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
 </div>

 <div className="mb-4">
 <label className="form-label fw-bold">Giới thiệu doanh nghiệp</label>
 <textarea className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
 </div>

 <div className="d-flex justify-content-end gap-3">
 <button type="submit" className="btn btn-primary fw-bold px-4">
 <i className="fas fa-save me-2"></i> Lưu thay đổi
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>);

}

export default ProviderProfile;