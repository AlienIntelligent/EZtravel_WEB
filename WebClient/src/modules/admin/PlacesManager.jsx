import { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2, RefreshCw, Search, Map, Download, Plus, MapPin, CheckCircle2,
  Filter, X, Eye, Edit2, MoreVertical, Trash2, AlertTriangle, Image as ImageIcon, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "../../shared/components/ImageUpload";
import {
  useGetAdminPlacesQuery,
  useCreateAdminPlaceMutation,
  useUpdateAdminPlaceMutation,
  useDeleteAdminPlaceMutation,
  useUploadAdminImageMutation,
} from "../../store/apis/adminApi";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  ACTIVE: { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', text: 'Hoạt động' },
  HIDDEN: { bg: 'bg-slate-50 border-slate-200 text-slate-600', dot: 'bg-slate-400', text: 'Đang ẩn' }
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

export default function PlacesManager() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dropdownRef = useRef(null);

  const { data: places = [], isLoading, isError, refetch } = useGetAdminPlacesQuery();
  const [createPlace, { isLoading: isCreating }] = useCreateAdminPlaceMutation();
  const [updatePlace, { isLoading: isUpdating }] = useUpdateAdminPlaceMutation();
  const [deletePlace, { isLoading: isDeleting }] = useDeleteAdminPlaceMutation();
  const [uploadAdminImage] = useUploadAdminImageMutation();

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return places.filter((place) => {
      const name = String(place.name ?? "").toLowerCase();
      const prov = String(place.provinceName ?? "").toLowerCase();
      return (
        (!normalizedKeyword || name.includes(normalizedKeyword) || prov.includes(normalizedKeyword)) &&
        (!statusFilter || place.status === statusFilter)
      );
    });
  }, [places, keyword, statusFilter]);

  const totalPlaces = places.length;
  const activePlaces = places.filter(p => p.status === 'ACTIVE').length;
  const hiddenPlaces = places.filter(p => p.status === 'HIDDEN').length;
  const verifiedPlaces = places.filter(p => p.isVerifiable).length;

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const currentData = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id, name) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Bạn có chắc muốn xóa địa điểm "${name}"?`)) return;

    try {
      await deletePlace(id).unwrap();
      toast({ title: "Thành công", description: "Đã xóa địa điểm.", variant: "success" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa địa điểm. Vui lòng thử lại.", variant: "error" });
    }
  };

  const handleStatusChange = async (place, nextStatus) => {
    setOpenDropdownId(null);
    try {
      await updatePlace({
        id: place.id,
        body: { ...place, status: nextStatus },
      }).unwrap();
      toast({ title: "Thành công", description: "Cập nhật trạng thái thành công.", variant: "success" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái.", variant: "error" });
    }
  };

  const handleSave = async () => {
    if (!selectedPlace.name || selectedPlace.name.trim().length < 2) {
      toast({ title: "Lỗi", description: "Tên địa điểm cần ít nhất 2 ký tự.", variant: "error" });
      return;
    }

    try {
      if (selectedPlace.id) {
        await updatePlace({ id: selectedPlace.id, body: selectedPlace }).unwrap();
        toast({ title: "Thành công", description: "Đã cập nhật địa điểm.", variant: "success" });
      } else {
        await createPlace(selectedPlace).unwrap();
        toast({ title: "Thành công", description: "Đã tạo địa điểm mới.", variant: "success" });
      }
      setSelectedPlace(null);
    } catch (err) {
      toast({ title: "Lỗi", description: err?.data?.message || "Không thể lưu thông tin.", variant: "error" });
    }
  };

  const handleUploadFn = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadAdminImage(formData).unwrap();
    return response.url;
  };

  const openCreateModal = () => {
    setSelectedPlace({
      name: "", description: "", provinceId: 1, regionId: 1, status: "ACTIVE", isVerifiable: true
    });
    setIsEditMode(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Địa điểm</h1>
        </div>
        <div className="flex max-w-xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Vui lòng kiểm tra kết nối mạng hoặc thử tải lại dữ liệu.
        </div>
        <Button variant="outline" onClick={refetch}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="pb-10 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Map className="w-6 h-6 text-primary" /> Quản lý Địa điểm
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách các tỉnh thành, địa danh và điểm du lịch.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Download className="w-4 h-4" /> Xuất dữ liệu
          </Button>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Thêm địa điểm
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border bg-background rounded-t-md divide-x divide-y lg:divide-y-0 divide-border overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <MapPin className="w-4 h-4" /> Tổng địa điểm
          </div>
          <div className="text-2xl font-bold text-foreground">{totalPlaces}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500" /> Đang hoạt động
          </div>
          <div className="text-2xl font-bold text-foreground">{activePlaces}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500" /> Đang ẩn
          </div>
          <div className="text-2xl font-bold text-foreground">{hiddenPlaces}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Cho phép xác nhận
          </div>
          <div className="text-2xl font-bold text-foreground">{verifiedPlaces}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border border-t-0 border-b-0 border-border bg-background">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-8 h-10 rounded-md border border-input text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Tìm theo tên địa điểm, tỉnh thành..."
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="w-[180px] relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-3 pr-8 rounded-md border border-input text-sm appearance-none bg-transparent outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="HIDDEN">Đang ẩn</option>
          </select>
        </div>
        <Button variant="outline" className="flex items-center gap-2 h-10 bg-white">
          <Filter className="w-4 h-4" /> Bộ lọc
        </Button>
        <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center bg-white" onClick={refetch}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-background rounded-b-md overflow-visible relative">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border bg-slate-50/50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã</th>
                <th className="px-6 py-4">Tên Địa Điểm</th>
                <th className="px-6 py-4">Tỉnh / Vùng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-muted-foreground">Không tìm thấy địa điểm phù hợp.</td></tr>
              ) : currentData.map((place) => {
                const isMenuOpen = openDropdownId === place.id;
                const statusConfig = statusColors[place.status] || statusColors.HIDDEN;
                
                return (
                  <tr key={place.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-muted-foreground font-mono">#{place.id}</td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        {place.coverImageUrl ? (
                          <img src={place.coverImageUrl} className="h-10 w-10 rounded-md object-cover border" alt="Cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-slate-100 border flex items-center justify-center text-slate-400">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                        <span className="truncate max-w-[200px]">{place.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div>{place.provinceName || `Tỉnh ${place.provinceId}`}</div>
                      <div className="text-xs text-muted-foreground">{place.regionName || `Vùng ${place.regionId}`}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                        {statusConfig.text}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button className="text-muted-foreground hover:text-primary p-1" onClick={() => { setSelectedPlace(place); setIsEditMode(false); }}><Eye className="w-4 h-4" /></button>
                        <button className="text-muted-foreground hover:text-blue-500 p-1" onClick={() => { setSelectedPlace(place); setIsEditMode(true); }}><Edit2 className="w-4 h-4" /></button>
                        <button className={`p-1 rounded ${isMenuOpen ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-muted-foreground hover:bg-slate-100'}`} onClick={() => setOpenDropdownId(isMenuOpen ? null : place.id)}>
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {isMenuOpen && (
                          <div ref={dropdownRef} className="absolute right-8 top-0 mt-8 w-48 bg-white border border-border shadow-lg rounded-md py-1 z-50 flex flex-col">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full text-left" onClick={() => handleStatusChange(place, place.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE')}>
                              {place.status === 'ACTIVE' ? "Ẩn địa điểm" : "Kích hoạt"}
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t" onClick={() => handleDelete(place.id, place.name)}>
                              <Trash2 className="w-4 h-4" /> Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border p-4 flex justify-between items-center bg-background">
          <div className="text-sm text-muted-foreground">Hiển thị {currentData.length} / {filteredPlaces.length}</div>
          <div className="flex gap-1">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-slate-50 disabled:opacity-50">&lt;</button>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-slate-50 disabled:opacity-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal Details / Form */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> {isEditMode ? (selectedPlace.id ? "Sửa địa điểm" : "Thêm mới") : "Chi tiết"}
              </h3>
              <button onClick={() => setSelectedPlace(null)} className="text-muted-foreground hover:text-foreground"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                  <TabsTrigger value="image">Ảnh đại diện</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-0">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Tên địa điểm</label>
                    <input className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPlace.name} onChange={e => setSelectedPlace({...selectedPlace, name: e.target.value})} disabled={!isEditMode} placeholder="Ví dụ: Vịnh Hạ Long" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">ID Tỉnh/Thành phố</label>
                      <input type="number" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPlace.provinceId || ''} onChange={e => setSelectedPlace({...selectedPlace, provinceId: Number(e.target.value)})} disabled={!isEditMode} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">ID Vùng miền</label>
                      <input type="number" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPlace.regionId || ''} onChange={e => setSelectedPlace({...selectedPlace, regionId: Number(e.target.value)})} disabled={!isEditMode} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Kinh độ</label>
                      <input type="number" step="any" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPlace.longitude || ''} onChange={e => setSelectedPlace({...selectedPlace, longitude: Number(e.target.value)})} disabled={!isEditMode} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Vĩ độ</label>
                      <input type="number" step="any" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPlace.latitude || ''} onChange={e => setSelectedPlace({...selectedPlace, latitude: Number(e.target.value)})} disabled={!isEditMode} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái</label>
                    <select className="mt-1 w-full h-10 px-3 border rounded-md bg-transparent" value={selectedPlace.status} onChange={e => setSelectedPlace({...selectedPlace, status: e.target.value})} disabled={!isEditMode}>
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="HIDDEN">Ẩn</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Mô tả giới thiệu</label>
                    <textarea className="mt-1 w-full p-3 border rounded-md min-h-[100px]" value={selectedPlace.description || ''} onChange={e => setSelectedPlace({...selectedPlace, description: e.target.value})} disabled={!isEditMode} />
                  </div>
                </TabsContent>
                <TabsContent value="image" className="space-y-4 mt-0">
                   {!isEditMode && !selectedPlace.coverImageUrl ? (
                      <div className="text-center p-10 text-muted-foreground border rounded-md">Chưa có ảnh đại diện</div>
                   ) : (
                     <ImageUpload 
                        currentImage={selectedPlace.coverImageUrl} 
                        uploadFn={isEditMode ? handleUploadFn : null}
                        onUpload={(f, url) => isEditMode && setSelectedPlace({...selectedPlace, coverImageUrl: url})}
                     />
                   )}
                </TabsContent>
              </Tabs>
            </div>
            <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedPlace(null)}>Đóng</Button>
              {isEditMode && (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave} disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Lưu thay đổi
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}