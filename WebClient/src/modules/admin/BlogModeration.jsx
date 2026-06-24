import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, Eye, Trash2, CheckCircle, RefreshCw, AlertTriangle,
  MessageSquare, User, Calendar, ThumbsUp, ShieldAlert, Image as ImageIcon, Download, MoreVertical, X, Loader2, Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Pagination from '../../shared/components/Pagination';
import ImageUpload from '../../shared/components/ImageUpload';
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAdminBlogsQuery,
  useUpdateAdminBlogStatusMutation,
  useDeleteAdminBlogMutation,
  useUploadAdminImageMutation,
  useUpdateAdminBlogMutation
} from "../../store/apis/adminApi";

export default function BlogModeration() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  const { data: blogs = [], isLoading, isError, refetch } = useGetAdminBlogsQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminBlogStatusMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteAdminBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateAdminBlogMutation();
  const [uploadAdminImage] = useUploadAdminImageMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    return blogs.filter(item => {
      const title = String(item.title ?? "").toLowerCase();
      const author = String(item.authorName ?? "").toLowerCase();
      const matchSearch = title.includes(searchTerm.toLowerCase()) || author.includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [blogs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PUBLISHED': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Đã xuất bản</Badge>;
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Chờ duyệt</Badge>;
      case 'REPORTED': return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200"><AlertTriangle className="w-3 h-3 mr-1"/> Bị báo cáo</Badge>;
      case 'REJECTED': return <Badge className="bg-slate-500/10 text-slate-600 border-slate-200">Bị từ chối</Badge>;
      case 'HIDDEN': return <Badge className="bg-slate-500/10 text-slate-600 border-slate-200">Đã ẩn</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast({ title: "Thành công", description: `Đã cập nhật trạng thái thành ${newStatus}.`, variant: "success" });
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost({ ...selectedPost, status: newStatus });
      }
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái.", variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.")) return;
    try {
      await deleteBlog(id).unwrap();
      toast({ title: "Thành công", description: "Đã xóa bài viết.", variant: "success" });
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
      }
      setOpenDropdownId(null);
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa bài viết.", variant: "error" });
    }
  };

  const handleSave = async () => {
    if (!selectedPost.title || selectedPost.title.trim().length < 5) {
      toast({ title: "Lỗi", description: "Tiêu đề cần ít nhất 5 ký tự.", variant: "error" });
      return;
    }
    try {
      await updateBlog({ 
        id: selectedPost.id, 
        body: {
          title: selectedPost.title,
          summary: selectedPost.summary,
          content: selectedPost.content,
          thumbnailUrl: selectedPost.thumbnail,
          status: selectedPost.status
        }
      }).unwrap();
      toast({ title: "Thành công", description: "Đã lưu thông tin bài viết.", variant: "success" });
      setIsEditMode(false);
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật bài viết.", variant: "error" });
    }
  };

  const handleUploadFn = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadAdminImage(formData).unwrap();
    return response.url;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Kiểm duyệt Bài viết
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi, kiểm duyệt và quản lý các bài viết trên cộng đồng ezTravel.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" /> Làm mới
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border bg-background rounded-t-md divide-x divide-y lg:divide-y-0 divide-border overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <MessageSquare className="w-4 h-4" /> Tổng bài viết
          </div>
          <div className="text-2xl font-bold text-foreground">{blogs.length}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500" /> Chờ duyệt
          </div>
          <div className="text-2xl font-bold text-foreground">{blogs.filter(b => b.status === 'PENDING').length}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500" /> Đã xuất bản
          </div>
          <div className="text-2xl font-bold text-foreground">{blogs.filter(b => b.status === 'PUBLISHED').length}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Bị báo cáo
          </div>
          <div className="text-2xl font-bold text-foreground">{blogs.filter(b => b.status === 'REPORTED').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-background p-4 border border-t-0 border-b-0 border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề, tác giả..." 
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="w-full sm:w-auto px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Tất cả bài viết</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="REPORTED">Bị báo cáo vi phạm</option>
            <option value="REJECTED">Đã từ chối/Gỡ</option>
            <option value="HIDDEN">Đã ẩn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background rounded-b-md border border-border shadow-sm overflow-visible relative">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-slate-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Mã Bài</th>
                <th className="px-6 py-4 font-medium">Tiêu đề & Tác giả</th>
                <th className="px-6 py-4 font-medium">Tương tác</th>
                <th className="px-6 py-4 font-medium">Thời gian</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentData.length > 0 ? currentData.map((item) => {
                const isMenuOpen = openDropdownId === item.id;
                return (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground line-clamp-1" title={item.title}>{item.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" /> {item.authorName || 'Traveler'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1" title="Lượt xem"><Eye className="h-3 w-3"/> {item.viewCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3"/>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 relative">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedPost(item); setIsEditMode(false); }}>
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedPost(item); setIsEditMode(true); }}>
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setOpenDropdownId(isMenuOpen ? null : item.id)}>
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      {isMenuOpen && (
                        <div ref={dropdownRef} className="absolute right-8 top-0 mt-8 w-48 bg-white border border-border shadow-lg rounded-md py-1 z-50 flex flex-col text-left">
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full" onClick={() => handleStatusChange(item.id, 'PUBLISHED')}>
                            Duyệt (Published)
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full" onClick={() => handleStatusChange(item.id, 'HIDDEN')}>
                            Ẩn bài (Hidden)
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full border-t" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" /> Xóa bài
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
              }) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy dữ liệu bài viết phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                {isEditMode ? "Chỉnh sửa bài viết" : "Kiểm duyệt Nội dung"}
              </h3>
              <button onClick={() => setSelectedPost(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="content">Nội dung</TabsTrigger>
                  <TabsTrigger value="cover">Ảnh Bìa (Cover)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1"><User className="h-4 w-4"/> {selectedPost.authorName || 'Traveler'}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(selectedPost.status)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Tiêu đề bài viết</label>
                    <input 
                      className="mt-1 w-full h-10 px-3 border rounded-md" 
                      value={selectedPost.title} 
                      onChange={e => setSelectedPost({...selectedPost, title: e.target.value})} 
                      disabled={!isEditMode} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Tóm tắt (Summary)</label>
                    <textarea 
                      className="mt-1 w-full p-3 border rounded-md min-h-[60px]" 
                      value={selectedPost.summary || ''} 
                      onChange={e => setSelectedPost({...selectedPost, summary: e.target.value})} 
                      disabled={!isEditMode} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Nội dung chi tiết</label>
                    <textarea 
                      className="mt-1 w-full p-3 border rounded-md min-h-[150px]" 
                      value={selectedPost.content || ''} 
                      onChange={e => setSelectedPost({...selectedPost, content: e.target.value})} 
                      disabled={!isEditMode} 
                    />
                  </div>
                  {isEditMode && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái</label>
                      <select 
                        className="mt-1 w-full h-10 px-3 border rounded-md" 
                        value={selectedPost.status} 
                        onChange={e => setSelectedPost({...selectedPost, status: e.target.value})}
                      >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="PUBLISHED">Đã xuất bản</option>
                        <option value="REPORTED">Bị báo cáo</option>
                        <option value="REJECTED">Bị từ chối</option>
                        <option value="HIDDEN">Đã ẩn</option>
                      </select>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cover" className="mt-0 space-y-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Ảnh bìa bài viết</p>
                  {!isEditMode && !selectedPost.thumbnail ? (
                    <div className="text-center p-10 text-muted-foreground border rounded-md">Chưa có ảnh bìa</div>
                  ) : (
                    <ImageUpload 
                      currentImage={selectedPost.thumbnail} 
                      uploadFn={isEditMode ? handleUploadFn : null}
                      onUpload={(file, url) => isEditMode && setSelectedPost({...selectedPost, thumbnail: url})}
                      label="Tải ảnh bìa bài viết lên"
                      helpText="Định dạng JPG, PNG, WEBP (Tối đa 5MB)"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Mã bài viết: <span className="font-mono">#{selectedPost.id}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedPost(null)}>Đóng</Button>
                {isEditMode ? (
                  <Button className="bg-primary text-white" onClick={handleSave} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Lưu thay đổi
                  </Button>
                ) : (
                  <>
                    <Button variant="destructive" onClick={() => handleDelete(selectedPost.id)} disabled={isDeleting}>
                      {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Xóa bài
                    </Button>
                    {selectedPost.status !== 'PUBLISHED' && (
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusChange(selectedPost.id, 'PUBLISHED')} disabled={isUpdatingStatus}>
                        {isUpdatingStatus && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Phê duyệt xuất bản
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}