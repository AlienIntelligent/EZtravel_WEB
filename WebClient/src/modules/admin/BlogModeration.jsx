
function BlogModeration() {
  return (
    <div className="container-fluid py-4">
        <h3 className="mb-4 font-weight-bold text-dark">Kiểm duyệt Bài viết</h3>
        <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
            <div className="card-body p-5 text-center">
                <i className="fas fa-tools fa-4x text-muted mb-4"></i>
                <h4 className="fw-bold mb-3">Tính năng đang phát triển</h4>
                <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
                    Tính năng kiểm duyệt bài viết đang được xây dựng ở phía Backend. Vui lòng quay lại sau khi hệ thống hoàn thiện các API cần thiết.
                </p>
            </div>
        </div>
    </div>);

}

export default BlogModeration;