import { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2, RefreshCw, Search, Plus, Filter, X, Eye, Edit2, MoreVertical, Trash2, AlertTriangle, Store, MapPin, DollarSign, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAdminServicesQuery,
  useUpdateAdminServiceStatusMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation
} from "../../store/apis/adminApi";
import Pagination from "../../shared/components/Pagination";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const statusColors = {
  APPROVED: { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', text: 'Đã duyệt' },
  PENDING: { bg: 'bg-amber-50 border-amber-100 text-amber-700', dot: 'bg-amber-500', text: 'Chờ duyệt' },
  REJECTED: { bg: 'bg-rose-50 border-rose-100 text-rose-700', dot: 'bg-rose-500', text: 'Từ chối' },
};

export default function ServiceModeration() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dropdownRef = useRef(null);

  const { data: services = [], isLoading, isError, refetch } = useGetAdminServicesQuery();
  const [updateService, { isLoading: isUpdating }] = useUpdateAdminServiceMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminServiceStatusMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteAdminServiceMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServices = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return services.filter((srv) => {
      const name = String(srv.name ?? "").toLowerCase();
      const provider = String(srv.providerName ?? "").toLowerCase();
      
      const matchSearch = (!normalizedKeyword || name.includes(normalizedKeyword) || provider.includes(normalizedKeyword));
      const matchStatus = (!statusFilter || srv.status === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [services, keyword, statusFilter]);

  const totalServices = services.length;
  const pendingServices = services.filter(p => p.status === 'PENDING').length;
  const approvedServices = services.filter(p => p.status === 'APPROVED').length;

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const currentData = filteredServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (id, name) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Bạn có chắc muốn xóa dịch vụ "${name}"? Hành động này không thể hoàn tác.`)) return;

    try {
      await deleteService(id).unwrap();
      toast({ title: "Thành công", description: "Đã xóa dịch vụ.", variant: "success" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa dịch vụ.", variant: "error" });
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    setOpenDropdownId(null);
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast({ title: "Thành công", description: `Đã cập nhật trạng thái thành ${nextStatus}.`, variant: "success" });
      if (selectedService && selectedService.id === id) {
        setSelectedService({ ...selectedService, status: nextStatus });
      }
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái.", variant: "error" });
    }
  };

  const handleSave = async () => {
    if (!selectedService.name || selectedService.name.trim().length < 2) {
      toast({ title: "Lỗi", description: "Tên dịch vụ cần ít nhất 2 ký tự.", variant: "error" });
      return;
    }

    try {
      await updateService({ id: selectedService.id, body: selectedService }).unwrap();
      toast({ title: "Thành công", description: "Đã lưu thông tin dịch vụ.", variant: "success" });
      setIsEditMode(false);
    } catch (err) {
      toast({ title: "Lỗi", description: err?.data?.message || "Không thể cập nhật.", variant: "error" });
    }
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
          <h1 className="text-2xl font-bold text-foreground">Kiểm duyệt Dịch vụ</h1>
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
            <Store className="w-6 h-6 text-primary" /> Kiểm duyệt Dịch vụ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý và phê duyệt các dịch vụ do nhà cung cấp đăng tải lên hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white" onClick={refetch}>
            <RefreshCw className="w-4 h-4" /> Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 border border-border bg-background rounded-t-md divide-x divide-y lg:divide-y-0 divide-border overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Store className="w-4 h-4" /> Tổng dịch vụ
          </div>
          <div className="text-2xl font-bold text-foreground">{totalServices}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500" /> Đã duyệt
          </div>
          <div className="text-2xl font-bold text-foreground">{approvedServices}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500" /> Chờ duyệt
          </div>
          <div className="text-2xl font-bold text-foreground">{pendingServices}</div>
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
            className="w-full pl-9 pr-8 h-10 rounded-md border border-input text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-transparent"
            placeholder="Tìm theo tên dịch vụ, NCC..."
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
            <option value="APPROVED">Đã duyệt</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
        </div>
        <Button variant="outline" className="flex items-center gap-2 h-10 bg-white">
          <Filter className="w-4 h-4" /> Bộ lọc
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-background rounded-b-md overflow-visible relative">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border bg-slate-50/50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã DV</th>
                <th className="px-6 py-4">Dịch Vụ</th>
                <th className="px-6 py-4">Nhà cung cấp</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-muted-foreground">Không tìm thấy dịch vụ nào.</td></tr>
              ) : currentData.map((srv) => {
                const isMenuOpen = openDropdownId === srv.id;
                const statusConfig = statusColors[srv.status] || statusColors.PENDING;
                
                return (
                  <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-muted-foreground font-mono">#{srv.id}</td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[200px]" title={srv.name}>{srv.name}</span>
                        <span className="text-xs text-muted-foreground font-normal flex items-center gap-1"><DollarSign className="w-3 h-3"/> {formatCurrency(srv.price)} - Loại: {srv.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-foreground">{srv.providerName || `NCC #${srv.providerId}`}</td>
                    <td className="px-6 py-3">
                      <div className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                        {statusConfig.text}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedService(srv); setIsEditMode(false); }}>
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedService(srv); setIsEditMode(true); }}>
                          <Edit2 className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setOpenDropdownId(isMenuOpen ? null : srv.id)}>
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        {isMenuOpen && (
                          <div ref={dropdownRef} className="absolute right-8 top-0 mt-8 w-48 bg-white border border-border shadow-lg rounded-md py-1 z-50 flex flex-col text-left">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full" onClick={() => handleStatusChange(srv.id, 'APPROVED')}>
                              Duyệt (Approve)
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full" onClick={() => handleStatusChange(srv.id, 'REJECTED')}>
                              Từ chối (Reject)
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full border-t" onClick={() => handleDelete(srv.id, srv.name)}>
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

      {/* Modal Details / Form */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> {isEditMode ? "Sửa Dịch vụ" : "Chi tiết Dịch vụ"}
              </h3>
              <button onClick={() => setSelectedService(null)} className="text-muted-foreground hover:text-foreground"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <p className="text-sm text-muted-foreground font-mono mb-2">Mã DV: #{selectedService.id}</p>
                 </div>
                 <div className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[selectedService.status]?.bg || statusColors.PENDING.bg}`}>
                   {statusColors[selectedService.status]?.text || selectedService.status}
                 </div>
               </div>

               <div>
                 <label className="text-xs font-semibold text-muted-foreground uppercase">Tên dịch vụ</label>
                 <input className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedService.name || ''} onChange={e => setSelectedService({...selectedService, name: e.target.value})} disabled={!isEditMode} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase">Nhà cung cấp</label>
                   <input className="mt-1 w-full h-10 px-3 border rounded-md bg-muted/50" value={selectedService.providerName || `NCC #${selectedService.providerId}`} disabled />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase">Loại hình</label>
                   <input className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedService.type || ''} onChange={e => setSelectedService({...selectedService, type: e.target.value})} disabled={!isEditMode} />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase">Đơn giá (VNĐ)</label>
                   <input type="number" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedService.price || ''} onChange={e => setSelectedService({...selectedService, price: e.target.value})} disabled={!isEditMode} />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái</label>
                   <select className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedService.status} onChange={e => setSelectedService({...selectedService, status: e.target.value})} disabled={!isEditMode}>
                     <option value="APPROVED">Đã duyệt</option>
                     <option value="PENDING">Chờ duyệt</option>
                     <option value="REJECTED">Từ chối</option>
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="text-xs font-semibold text-muted-foreground uppercase">Địa chỉ</label>
                   <input className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedService.location || ''} onChange={e => setSelectedService({...selectedService, location: e.target.value})} disabled={!isEditMode} />
                 </div>
               </div>
               
               <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Mô tả dịch vụ</label>
                  <textarea className="mt-1 w-full p-3 border rounded-md min-h-[100px]" value={selectedService.description || ''} onChange={e => setSelectedService({...selectedService, description: e.target.value})} disabled={!isEditMode} />
               </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedService(null)}>Đóng</Button>
              {isEditMode ? (
                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSave} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Lưu thay đổi
                </Button>
              ) : (
                selectedService.status === 'PENDING' && (
                  <>
                    <Button variant="destructive" onClick={() => handleStatusChange(selectedService.id, 'REJECTED')} disabled={isUpdatingStatus}>Từ chối</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusChange(selectedService.id, 'APPROVED')} disabled={isUpdatingStatus}>Phê duyệt</Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}