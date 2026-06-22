import { useMemo, useState  } from "react";
import {
  useApproveProviderMutation,
  useGetProviderStatusQuery,
  useRejectProviderMutation } from
'../../store/apis/providerApi';

const ADMIN_APPROVER_ID = 1;

function ProviderApproval() {
  const [keyword, setKeyword] = useState('');
  const [rejectingProviderId, setRejectingProviderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const {
    data: providers = [],
    isLoading,
    isError,
    refetch
  } = useGetProviderStatusQuery();

  const [approveProvider, { isLoading: isApproving }] = useApproveProviderMutation();
  const [rejectProvider, { isLoading: isRejecting }] = useRejectProviderMutation();

  const filteredProviders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return providers;
    }

    return providers.filter((provider) => {
      const providerName = provider.tenNhaCungCap ?? provider.companyName ?? '';
      const email = provider.email ?? provider.contactEmail ?? '';
      const phone = provider.soDienThoai ?? provider.contactPhone ?? '';

      return (
        providerName.toLowerCase().includes(normalizedKeyword) ||
        email.toLowerCase().includes(normalizedKeyword) ||
        phone.toLowerCase().includes(normalizedKeyword));

    });
  }, [providers, keyword]);

  const getProviderName = (provider) => {
    return provider.tenNhaCungCap ?? provider.companyName ?? 'Nhà cung cấp chưa đặt tên';
  };

  const getProviderEmail = (provider) => {
    return provider.email ?? provider.contactEmail ?? '—';
  };

  const getProviderPhone = (provider) => {
    return provider.soDienThoai ?? provider.contactPhone ?? '—';
  };

  const getProviderStatus = (provider) => {
    return provider.trangThai ?? provider.status ?? 'PENDING';
  };

  const handleApprove = async (providerId, providerName) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn duyệt "${providerName}" không?`);

    if (!confirmed) {
      return;
    }

    try {
      await approveProvider({
        providerId,
        body: {
          approvedBy: ADMIN_APPROVER_ID
        }
      }).unwrap();

      await refetch();
    } catch {
      alert('Có lỗi xảy ra khi duyệt nhà cung cấp. Vui lòng thử lại.');
    }
  };

  const openRejectModal = (providerId) => {
    setRejectingProviderId(providerId);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectingProviderId(null);
    setRejectReason('');
  };

  const handleReject = async () => {
    if (rejectingProviderId === null) {
      return;
    }

    const reason = rejectReason.trim();

    if (!reason) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }

    try {
      await rejectProvider({
        providerId: rejectingProviderId,
        body: {
          reason
        }
      }).unwrap();

      closeRejectModal();
      await refetch();
    } catch {
      alert('Có lỗi xảy ra khi từ chối nhà cung cấp. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '320px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="text-muted mb-0">Đang tải danh sách nhà cung cấp chờ duyệt...</p>
                </div>
            </div>
        </div>);

  }

  if (isError) {
    return (
      <div className="container-fluid py-4">
            <div className="alert alert-danger border-0 shadow-sm" role="alert">
                <h5 className="alert-heading mb-2">Không thể tải danh sách nhà cung cấp</h5>
                <p className="mb-3">
                    Vui lòng kiểm tra kết nối tới backend hoặc thử tải lại dữ liệu.
                </p>
                <button type="button" className="btn btn-outline-danger" onClick={() => refetch()}>
                    Thử lại
                </button>
            </div>
        </div>);

  }

  return (
    <div className="container-fluid py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <h3 className="mb-1 fw-bold text-dark">Duyệt nhà cung cấp</h3>
                <p className="text-muted mb-0">
                    Danh sách này được lấy từ endpoint nhà cung cấp chờ duyệt của backend.
                </p>
            </div>
        </div>

        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white border-bottom p-3">
                <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)} />
          
            </div>

            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4 py-3 border-top-0">Nhà cung cấp</th>
                                <th className="py-3 border-top-0">Email</th>
                                <th className="py-3 border-top-0">Điện thoại</th>
                                <th className="py-3 border-top-0 text-center">Trạng thái</th>
                                <th className="px-4 py-3 border-top-0 text-end">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProviders.length === 0 ?
                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Không có nhà cung cấp nào đang chờ duyệt.
                                    </td>
                                </tr> :

                filteredProviders.map((provider) => {
                  const providerName = getProviderName(provider);
                  const status = getProviderStatus(provider);

                  return (
                    <tr key={provider.id}>
                                            <td className="px-4">
                                                <div className="fw-semibold">{providerName}</div>
                                                <small className="text-muted">ID: {provider.id}</small>
                                            </td>

                                            <td>{getProviderEmail(provider)}</td>
                                            <td>{getProviderPhone(provider)}</td>

                                            <td className="text-center">
                                                <span className="badge bg-warning text-dark">
                                                    {status}
                                                </span>
                                            </td>

                                            <td className="px-4 text-end">
                                                <div className="btn-group">
                                                    <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(provider.id, providerName)}
                            disabled={isApproving || isRejecting}>
                            
                                                        Duyệt
                                                    </button>
                                                    <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openRejectModal(provider.id)}
                            disabled={isApproving || isRejecting}>
                            
                                                        Từ chối
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>);

                })
                }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card-footer bg-white border-top py-3">
                <span className="text-muted">
                    Hiển thị {filteredProviders.length} / {providers.length} nhà cung cấp chờ duyệt.
                </span>
            </div>
        </div>

        {rejectingProviderId !== null &&
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
        
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">Từ chối nhà cung cấp</h5>
                            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeRejectModal}>
              </button>
                        </div>

                        <div className="modal-body">
                            <label className="form-label">Lý do từ chối</label>
                            <textarea
                className="form-control"
                rows={4}
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Nhập lý do để nhà cung cấp có thể điều chỉnh hồ sơ..." />
              
                        </div>

                        <div className="modal-footer">
                            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeRejectModal}
                disabled={isRejecting}>
                
                                Hủy
                            </button>
                            <button
                type="button"
                className="btn btn-danger"
                onClick={handleReject}
                disabled={isRejecting}>
                
                                {isRejecting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
      }
    </div>);

}

export default ProviderApproval;
