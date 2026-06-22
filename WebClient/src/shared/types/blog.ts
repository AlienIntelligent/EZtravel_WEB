export interface Blog {
    id: string; // MaBaiViet
    userId: string; // MaNguoiDung
    title: string; // TieuDe
    slug: string; // Slug
    summary?: string; // TomTat
    content: string; // NoiDung
    thumbnail?: string; // Thumbnail
    views: number; // LuotXem
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; // TrangThai
    placeId?: string; // MaDiaDiem
    createdAt: string; // NgayTao
    updatedAt: string; // NgayCapNhat
}
