import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
 Edit3,
 Loader2,
 Plus,
 RefreshCw,
 Search,
 Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "../../store/hooks";
import {
 useDeleteProviderServiceMutation,
 useSearchProviderServicesQuery,
} from "../../store/apis/serviceApi";
import { PROVIDER_APPROVED_ROUTES } from "../../router/routes";
import Pagination from "../../shared/components/Pagination";

const SERVICE_TABS = [
 { key: "hotels", label: "Khách sạn" },
 { key: "restaurants", label: "Nhà hàng" },
 { key: "activities", label: "Hoạt động" },
 { key: "vehicles", label: "Phương tiện" },
];

const inputClass =
 "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const getServiceId = (service) =>
 service.id ??
 service.maKhachSan ??
 service.maNhaHang ??
 service.maHoatDong ??
 service.maPhuongTien ??
 null;

const getServiceName = (service) =>
 service.tenDichVu ??
 service.tenKhachSan ??
 service.tenNhaHang ??
 service.tenHoatDong ??
 service.tenPhuongTien ??
 service.name ??
 "Dịch vụ chưa đặt tên";

const getServiceDescription = (service) =>
 service.moTa ?? service.description ?? "Chưa có mô tả.";

const getServiceAddress = (service) =>
 service.diaChi ?? service.address ?? "Chưa cập nhật";

const getServicePrice = (service) => {
 const price = service.giaThamKhao ?? service.price;
 if (price === undefined || price === null) return "Chưa cập nhật";

 return new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 maximumFractionDigits: 0,
 }).format(price);
};

const getServiceStatus = (service) =>
 service.trangThai ?? service.status ?? "Chưa xác định";

export default function ServicesManager() {
 const navigate = useNavigate();
 const currentUser = useAppSelector((state) => state.auth.user);
 const [activeCategory, setActiveCategory] = useState("hotels");
 const [keyword, setKeyword] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const ITEMS_PER_PAGE = 5;

 const {
 data: services = [],
 isLoading,
 isError,
 refetch,
 } = useSearchProviderServicesQuery(
 { category: activeCategory, keyword },
 { skip: !currentUser },
 );
 const [deleteService, { isLoading: isDeleting }] =
 useDeleteProviderServiceMutation();

 const filteredServices = useMemo(() => {
 const normalized = keyword.trim().toLowerCase();
 if (!normalized) return services;

 return services.filter((service) =>
 [
 getServiceName(service),
 getServiceDescription(service),
 getServiceAddress(service),
 ].some((value) => value.toLowerCase().includes(normalized)),
 );
 }, [keyword, services]);

 const paginatedServices = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredServices.slice(start, start + ITEMS_PER_PAGE);
 }, [filteredServices, currentPage]);

 const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

 useMemo(() => {
  setCurrentPage(1);
 }, [keyword, activeCategory]);

 const handleDelete = async (service) => {
 const serviceId = getServiceId(service);
 const serviceName = getServiceName(service);

 if (serviceId === null) {
 await Swal.fire("Lỗi", "Không xác định được ID dịch vụ để xóa.", "error");
 return;
 }

 const result = await Swal.fire({
 title: "Xác nhận xóa",
 text: `Bạn có chắc chắn muốn xóa dịch vụ "${serviceName}" không?`,
 icon: "warning",
 showCancelButton: true,
 confirmButtonColor: "#dc2626",
 cancelButtonColor: "#475569",
 confirmButtonText: "Xóa",
 cancelButtonText: "Hủy",
 });

 if (!result.isConfirmed) return;

 try {
 await deleteService({ category: activeCategory, id: serviceId }).unwrap();
 await refetch();
 await Swal.fire("Đã xóa", "Dịch vụ đã được xóa thành công.", "success");
 } catch (error) {
 await Swal.fire(
 "Lỗi",
 error?.data?.message ??
 error?.message ??
 "Không thể xóa dịch vụ. Vui lòng thử lại.",
 "error",
 );
 }
 };

 const handleOpenEdit = (service) => {
 const serviceId = getServiceId(service);
 if (serviceId === null) {
 void Swal.fire("Lỗi", "Không xác định được ID dịch vụ để chỉnh sửa.", "error");
 return;
 }
 navigate(
 PROVIDER_APPROVED_ROUTES.SERVICE_EDIT.replace(":id", String(serviceId)),
 );
 };

 if (!currentUser) {
 return (
 <div className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
 Vui lòng đăng nhập bằng tài khoản nhà cung cấp để quản lý dịch vụ.
 </div>
 );
 }

 return (
 <div className="space-y-6">
 <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h1 className="page-title">Quản lý dịch vụ</h1>
 <p className="page-description">
 {filteredServices.length} dịch vụ trong nhóm đang chọn
 </p>
 </div>
 <Button
 type="button"
 className="self-start sm:self-auto"
 onClick={() => navigate(PROVIDER_APPROVED_ROUTES.SERVICE_CREATE)}
 >
 <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
 Thêm dịch vụ
 </Button>
 </header>

 <div className="space-y-4">
 <div
 className="flex gap-1 overflow-x-auto border-b border-border pb-px"
 role="tablist"
 aria-label="Nhóm dịch vụ"
 >
 {SERVICE_TABS.map((tab) => {
 const selected = activeCategory === tab.key;
 return (
 <button
 key={tab.key}
 type="button"
 role="tab"
 aria-selected={selected}
 className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition ${
 selected
 ? "border-primary text-primary"
 : "border-transparent text-muted-foreground hover:text-foreground"
 }`}
 onClick={() => setActiveCategory(tab.key)}
 >
 {tab.label}
 </button>
 );
 })}
 </div>

 <div className="flex flex-col gap-3 sm:flex-row">
 <div className="relative flex-1">
 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
 <label htmlFor="provider-service-search" className="sr-only">
 Tìm kiếm dịch vụ
 </label>
 <input
 id="provider-service-search"
 type="search"
 className={`${inputClass} pl-9`}
 placeholder="Tìm theo tên, mô tả hoặc địa chỉ"
 value={keyword}
 onChange={(event) => setKeyword(event.target.value)}
 />
 </div>
 <Button type="button" variant="outline" onClick={refetch} disabled={isLoading}>
 <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
 Làm mới
 </Button>
 </div>
 </div>

 <section className="overflow-hidden rounded-md border border-border bg-background">
 {isLoading ? (
 <div className="flex min-h-64 items-center justify-center" role="status">
 <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
 <span className="sr-only">Đang tải dịch vụ</span>
 </div>
 ) : isError ? (
 <div className="p-5">
 <div className="border-l-4 border-rose-600 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
 Không thể tải danh sách dịch vụ. Vui lòng thử lại.
 </div>
 </div>
 ) : filteredServices.length === 0 ? (
 <div className="px-5 py-14 text-center">
 <p className="font-semibold text-foreground">Chưa có dịch vụ trong nhóm này</p>
 <p className="mt-1 text-sm text-muted-foreground">Tạo dịch vụ mới hoặc thay đổi từ khóa tìm kiếm.</p>
 </div>
 ) : (
 <>
 <div className="divide-y divide-slate-100 md:hidden">
 {paginatedServices.map((service) => {
 const serviceId = getServiceId(service);
 const serviceName = getServiceName(service);
 return (
 <article key={`${activeCategory}-${serviceId ?? serviceName}`} className="space-y-3 p-4">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <h2 className="truncate font-semibold text-foreground">{serviceName}</h2>
 <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
 {getServiceDescription(service)}
 </p>
 </div>
 <span className="shrink-0 rounded bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
 {getServiceStatus(service)}
 </span>
 </div>
 <dl className="grid grid-cols-2 gap-3 text-sm">
 <div>
 <dt className="text-xs text-muted-foreground">Địa chỉ</dt>
 <dd className="mt-1 line-clamp-2 text-muted-foreground">{getServiceAddress(service)}</dd>
 </div>
 <div>
 <dt className="text-xs text-muted-foreground">Giá tham khảo</dt>
 <dd className="mt-1 font-semibold text-foreground">{getServicePrice(service)}</dd>
 </div>
 </dl>
 <div className="flex justify-end gap-1 border-t border-border pt-3">
 <Button type="button" variant="ghost" size="icon" className="text-cta hover:bg-cta/10 hover:text-cta" onClick={() => handleOpenEdit(service)} aria-label={`Sửa ${serviceName}`} title="Sửa">
 <Edit3 className="h-4 w-4" aria-hidden="true" />
 </Button>
 <Button type="button" variant="ghost" size="icon" className="text-rose-700" onClick={() => handleDelete(service)} disabled={isDeleting || serviceId === null} aria-label={`Xóa ${serviceName}`} title="Xóa">
 <Trash2 className="h-4 w-4" aria-hidden="true" />
 </Button>
 </div>
 </article>
 );
 })}
 </div>

 <div className="hidden overflow-x-auto md:block">
 <table className="w-full min-w-[860px] border-collapse text-left text-sm">
 <thead className="border-b border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground">
 <tr>
 <th className="px-5 py-3 font-semibold">Dịch vụ</th>
 <th className="px-5 py-3 font-semibold">Địa chỉ</th>
 <th className="px-5 py-3 font-semibold">Giá tham khảo</th>
 <th className="px-5 py-3 font-semibold">Trạng thái</th>
 <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {paginatedServices.map((service) => {
 const serviceId = getServiceId(service);
 const serviceName = getServiceName(service);
 return (
 <tr key={`${activeCategory}-${serviceId ?? serviceName}`} className="hover:bg-background">
 <td className="max-w-sm px-5 py-4">
 <div className="font-semibold text-foreground">{serviceName}</div>
 <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{getServiceDescription(service)}</div>
 </td>
 <td className="max-w-xs px-5 py-4 text-muted-foreground">{getServiceAddress(service)}</td>
 <td className="whitespace-nowrap px-5 py-4 font-semibold text-muted-foreground">{getServicePrice(service)}</td>
 <td className="px-5 py-4">
 <span className="rounded bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
 {getServiceStatus(service)}
 </span>
 </td>
 <td className="px-5 py-4">
 <div className="flex justify-end gap-1">
 <Button type="button" variant="ghost" size="icon" className="text-cta hover:bg-cta/10 hover:text-cta" onClick={() => handleOpenEdit(service)} aria-label={`Sửa ${serviceName}`} title="Sửa">
 <Edit3 className="h-4 w-4" aria-hidden="true" />
 </Button>
 <Button type="button" variant="ghost" size="icon" className="text-rose-700" onClick={() => handleDelete(service)} disabled={isDeleting || serviceId === null} aria-label={`Xóa ${serviceName}`} title="Xóa">
 <Trash2 className="h-4 w-4" aria-hidden="true" />
 </Button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 {totalPages > 1 && (
 <div className="border-t border-border p-4">
 <Pagination
 currentPage={currentPage}
 totalPages={totalPages}
 onPageChange={setCurrentPage}
 />
 </div>
 )}
 </>
 )}
 </section>
 </div>
 );
}
