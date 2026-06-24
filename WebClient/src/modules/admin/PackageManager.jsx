import { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2, RefreshCw, Search, Plus, Filter, X, Eye, Edit2, MoreVertical, AlertTriangle, PackageSearch, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAdminProviderPackagesQuery,
  useCreateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageStatusMutation
} from "../../store/apis/adminApi";
import Pagination from "../../shared/components/Pagination";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function PackageManager() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dropdownRef = useRef(null);

  const { data: packages = [], isLoading, isError, refetch } = useGetAdminProviderPackagesQuery();
  const [createPackage, { isLoading: isCreating }] = useCreateAdminProviderPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdateAdminProviderPackageMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminProviderPackageStatusMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPackages = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return packages.filter((pkg) => {
      const name = String(pkg.name ?? "").toLowerCase();
      
      const matchSearch = (!normalizedKeyword || name.includes(normalizedKeyword));
      const matchStatus = statusFilter === "" ? true : statusFilter === "ACTIVE" ? pkg.isActive : !pkg.isActive;
      return matchSearch && matchStatus;
    });
  }, [packages, keyword, statusFilter]);

  const totalPackages = packages.length;
  const activePackages = packages.filter(p => p.isActive).length;

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const currentData = filteredPackages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusChange = async (id, nextStatus) => {
    setOpenDropdownId(null);
    try {
      await updateStatus({ id, isActive: nextStatus }).unwrap();
      toast({ title: "Thành công", description: `Đã cập nhật trạng thái.`, variant: "success" });
      if (selectedPackage && selectedPackage.id === id) {
        setSelectedPackage({ ...selectedPackage, isActive: nextStatus });
      }
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái.", variant: "error" });
    }
  };

  const handleSave = async () => {
    if (!selectedPackage.name || selectedPackage.name.trim().length < 2) {
      toast({ title: "Lỗi", description: "Tên gói cần ít nhất 2 ký tự.", variant: "error" });
      return;
    }

    try {
      const payload = {
        name: selectedPackage.name,
        description: selectedPackage.description,
        monthlyPrice: Number(selectedPackage.monthlyPrice),
        annualPrice: Number(selectedPackage.annualPrice),
        priorityCoefficient: Number(selectedPackage.priorityCoefficient),
        searchPriority: selectedPackage.searchPriority,
        aiPriority: selectedPackage.aiPriority,
        homePriority: selectedPackage.homePriority,
        partnerBadge: selectedPackage.partnerBadge
      };

      if (selectedPackage.id) {
        await updatePackage({ id: selectedPackage.id, body: payload }).unwrap();
        toast({ title: "Thành công", description: "Đã cập nhật gói dịch vụ.", variant: "success" });
      } else {
        await createPackage(payload).unwrap();
        toast({ title: "Thành công", description: "Đã tạo gói mới.", variant: "success" });
      }
      setSelectedPackage(null);
    } catch (err) {
      toast({ title: "Lỗi", description: err?.data?.message || "Không thể lưu thông tin.", variant: "error" });
    }
  };

  const openCreateModal = () => {
    setSelectedPackage({
      name: "", description: "", monthlyPrice: 0, annualPrice: 0, priorityCoefficient: 1.0,
      searchPriority: false, aiPriority: false, homePriority: false, partnerBadge: false
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
          <h1 className="text-2xl font-bold text-foreground">Quản lý Gói Dịch vụ</h1>
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
            <Package className="w-6 h-6 text-primary" /> Quản lý Gói Dịch vụ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý các gói đăng ký dành cho nhà cung cấp.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white" onClick={openCreateModal}>
            <Plus className="w-4 h-4" /> Thêm gói mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 border border-border bg-background rounded-t-md divide-x divide-y lg:divide-y-0 divide-border overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <PackageSearch className="w-4 h-4" /> Tổng số gói
          </div>
          <div className="text-2xl font-bold text-foreground">{totalPackages}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500" /> Đang hoạt động
          </div>
          <div className="text-2xl font-bold text-foreground">{activePackages}</div>
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
            placeholder="Tìm theo tên gói..."
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
            <option value="INACTIVE">Đã ẩn</option>
          </select>
        </div>
        <Button variant="outline" className="flex items-center gap-2 h-10 bg-white" onClick={refetch}>
          <RefreshCw className="w-4 h-4" /> Làm mới
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-background rounded-b-md overflow-visible relative">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border bg-slate-50/50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã</th>
                <th className="px-6 py-4">Gói dịch vụ</th>
                <th className="px-6 py-4">Mức giá</th>
                <th className="px-6 py-4">Quyền lợi (Hệ số)</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-muted-foreground">Không tìm thấy gói dịch vụ.</td></tr>
              ) : currentData.map((pkg) => {
                const isMenuOpen = openDropdownId === pkg.id;
                
                return (
                  <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-muted-foreground font-mono">#{pkg.id}</td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[200px]" title={pkg.name}>{pkg.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span>{formatCurrency(pkg.monthlyPrice)}/tháng</span>
                        <span>{formatCurrency(pkg.annualPrice)}/năm</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <span className="font-semibold text-blue-600">x{pkg.priorityCoefficient}</span>
                    </td>
                    <td className="px-6 py-3">
                      {pkg.isActive ? (
                        <div className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 border-emerald-100 text-emerald-700">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Hoạt động
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-50 border-slate-100 text-slate-600">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Đã tắt
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedPackage(pkg); setIsEditMode(false); }}>
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedPackage(pkg); setIsEditMode(true); }}>
                          <Edit2 className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setOpenDropdownId(isMenuOpen ? null : pkg.id)}>
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        {isMenuOpen && (
                          <div ref={dropdownRef} className="absolute right-8 top-0 mt-8 w-48 bg-white border border-border shadow-lg rounded-md py-1 z-50 flex flex-col text-left">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full" onClick={() => handleStatusChange(pkg.id, !pkg.isActive)}>
                              {pkg.isActive ? "Tắt gói (Deactivate)" : "Bật gói (Activate)"}
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
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> {isEditMode ? (selectedPackage.id ? "Sửa gói dịch vụ" : "Thêm gói dịch vụ") : "Chi tiết gói dịch vụ"}
              </h3>
              <button onClick={() => setSelectedPackage(null)} className="text-muted-foreground hover:text-foreground"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
               <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Tên gói</label>
                  <input className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPackage.name || ''} onChange={e => setSelectedPackage({...selectedPackage, name: e.target.value})} disabled={!isEditMode} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Giá theo tháng (VNĐ)</label>
                    <input type="number" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPackage.monthlyPrice || ''} onChange={e => setSelectedPackage({...selectedPackage, monthlyPrice: e.target.value})} disabled={!isEditMode} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Giá theo năm (VNĐ)</label>
                    <input type="number" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPackage.annualPrice || ''} onChange={e => setSelectedPackage({...selectedPackage, annualPrice: e.target.value})} disabled={!isEditMode} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Hệ số ưu tiên hiển thị</label>
                    <input type="number" step="0.01" className="mt-1 w-full h-10 px-3 border rounded-md" value={selectedPackage.priorityCoefficient || ''} onChange={e => setSelectedPackage({...selectedPackage, priorityCoefficient: e.target.value})} disabled={!isEditMode} />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Mô tả chi tiết</label>
                  <textarea className="mt-1 w-full p-3 border rounded-md min-h-[80px]" value={selectedPackage.description || ''} onChange={e => setSelectedPackage({...selectedPackage, description: e.target.value})} disabled={!isEditMode} />
               </div>
               
               <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Các quyền lợi đi kèm</label>
                  <div className="grid grid-cols-2 gap-3 border p-4 rounded-md">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedPackage.searchPriority} onChange={e => isEditMode && setSelectedPackage({...selectedPackage, searchPriority: e.target.checked})} disabled={!isEditMode} />
                      Ưu tiên trong tìm kiếm
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedPackage.aiPriority} onChange={e => isEditMode && setSelectedPackage({...selectedPackage, aiPriority: e.target.checked})} disabled={!isEditMode} />
                      Đề xuất AI
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedPackage.homePriority} onChange={e => isEditMode && setSelectedPackage({...selectedPackage, homePriority: e.target.checked})} disabled={!isEditMode} />
                      Nổi bật trang chủ
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedPackage.partnerBadge} onChange={e => isEditMode && setSelectedPackage({...selectedPackage, partnerBadge: e.target.checked})} disabled={!isEditMode} />
                      Huy hiệu đối tác uy tín
                    </label>
                  </div>
               </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedPackage(null)}>Đóng</Button>
              {isEditMode && (
                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSave} disabled={isCreating || isUpdating}>
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
