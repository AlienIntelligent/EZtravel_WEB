export interface Report {
    id: string; // MaBaoCao
    reporterId: string; // MaNguoiBaoCao
    blogId?: string; // MaBaiViet
    reviewId?: string; // MaDanhGia
    tripId?: string; // MaLichTrinh
    reason: string; // LyDo
    status: 'PENDING' | 'RESOLVED' | 'REJECTED'; // TrangThai
    createdAt: string; // NgayBaoCao
}
