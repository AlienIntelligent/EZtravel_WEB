import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
 ArrowLeft,
 Building2,
 ImageIcon,
 Loader2,
 MapPin,
 Save,
 Search,
 Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useGetExploreGridQuery } from "../../store/apis/exploreApi";
import {
 useCreateProviderServiceMutation,
 useSearchProviderServicesQuery,
 useUpdateProviderServiceMutation,
} from "../../store/apis/serviceApi";
import { PROVIDER_APPROVED_ROUTES } from "../../router/routes";

const categories = [
 { value: "hotels", label: "Khách sạn" },
 { value: "restaurants", label: "Nhà hàng" },
 { value: "activities", label: "Hoạt động / Tour" },
 { value: "vehicles", label: "Phương tiện" },
];

const serviceTypeToCategory = {
 KHACH_SAN: "hotels",
 NHA_HANG: "restaurants",
 HOAT_DONG: "activities",
 PHUONG_TIEN: "vehicles",
};

const emptyForm = {
 category: "hotels",
 name: "",
 placeId: "",
 placeName: "",
 description: "",
 address: "",
 priceFrom: "",
 priceTo: "",
 imageUrl: "",
 status: "ACTIVE",
};

const getServiceId = (service) =>
 service?.id ??
 service?.maDichVu ??
 service?.maKhachSan ??
 service?.maNhaHang ??
 service?.maHoatDong ??
 service?.maPhuongTien;

const getServiceName = (service) =>
 service?.name ??
 service?.tenDichVu ??
 service?.tenKhachSan ??
 service?.tenNhaHang ??
 service?.tenHoatDong ??
 service?.tenPhuongTien ??
 "";

const getCategory = (service) =>
 service?.category ??
 serviceTypeToCategory[String(service?.loaiDichVu ?? "").toUpperCase()] ??
 "hotels";

const toForm = (service) => ({
 category: getCategory(service),
 name: getServiceName(service),
 placeId: String(service?.maDiaDiem ?? ""),
 placeName:
 service?.tenDiaDiem ??
 (service?.maDiaDiem ? `Địa điểm #${service.maDiaDiem}` : ""),
 description: service?.moTa ?? service?.description ?? "",
 address: service?.diaChi ?? service?.address ?? "",
 priceFrom: String(
 service?.giaTu ??
 service?.giaThamKhao ??
 service?.giaTrungBinh ??
 service?.gia ??
 service?.price ??
 "",
 ),
 priceTo: String(service?.giaDen ?? ""),
 imageUrl: service?.anhDaiDien ?? service?.thumbnail ?? "",
 status: service?.trangThai ?? service?.status ?? "ACTIVE",
});

const getPlaceId = (place) => place?.id ?? place?.maDiaDiem;
const getPlaceName = (place) => place?.name ?? place?.tenDiaDiem ?? "Địa điểm";
const getPlaceAddress = (place) =>
 place?.address ?? place?.diaChi ?? place?.cityName ?? place?.tenTinhThanh ?? "";

export default function ProviderServiceFormPage({ mode = "create" }) {
 const isEdit = mode === "edit";
 const { id } = useParams();
 const serviceId = Number(id);
 const navigate = useNavigate();
 const { toast } = useToast();
 const [formDraft, setFormDraft] = useState(null);
 const [placeKeywordDraft, setPlaceKeywordDraft] = useState(null);
 const [showPlaces, setShowPlaces] = useState(false);
 const [error, setError] = useState("");

 const {
 data: services = [],
 isLoading: isLoadingServices,
 isError: isServicesError,
 refetch: refetchServices,
 } = useSearchProviderServicesQuery({}, { skip: !isEdit });
 const existingService = useMemo(
 () => services.find((service) => Number(getServiceId(service)) === serviceId),
 [serviceId, services],
 );
 const form =
 formDraft ??
 (isEdit && existingService ? toForm(existingService) : emptyForm);
 const placeKeyword = placeKeywordDraft ?? form.placeName;

 const {
 data: placeData,
 isFetching: isSearchingPlaces,
 isError: isPlaceSearchError,
 } = useGetExploreGridQuery(
 {
 type: "places",
 keyword: placeKeyword.trim(),
 page: 1,
 pageSize: 8,
 },
 { skip: placeKeyword.trim().length < 2 },
 );
 const places = Array.isArray(placeData)
 ? placeData
 : placeData?.items ?? placeData?.data ?? [];

 const [createService, { isLoading: isCreating }] =
 useCreateProviderServiceMutation();
 const [updateService, { isLoading: isUpdating }] =
 useUpdateProviderServiceMutation();
 const isSubmitting = isCreating || isUpdating;

 const updateField = (field) => (event) => {
 setFormDraft((current) => ({
 ...(current ?? form),
 [field]: event.target.value,
 }));
 if (error) setError("");
 };

 const handlePlaceChange = (event) => {
 const value = event.target.value;
 setPlaceKeywordDraft(value);
 setShowPlaces(true);
 setFormDraft((current) => ({
 ...(current ?? form),
 placeId: "",
 placeName: value,
 }));
 if (error) setError("");
 };

 const selectPlace = (place) => {
 const placeId = getPlaceId(place);
 const placeName = getPlaceName(place);
 setFormDraft((current) => ({
 ...(current ?? form),
 placeId: String(placeId),
 placeName,
 address: current.address || getPlaceAddress(place),
 }));
 setPlaceKeywordDraft(placeName);
 setShowPlaces(false);
 };

 const handleSubmit = async (event) => {
 event.preventDefault();
 const name = form.name.trim();
 const placeId = Number(form.placeId);
 const priceFrom = form.priceFrom === "" ? undefined : Number(form.priceFrom);
 const priceTo = form.priceTo === "" ? undefined : Number(form.priceTo);

 if (name.length < 2) {
 setError("Tên dịch vụ cần ít nhất 2 ký tự.");
 return;
 }
 if (!Number.isInteger(placeId) || placeId <= 0) {
 setError("Vui lòng tìm và chọn một địa điểm hợp lệ.");
 return;
 }
 if (
 (priceFrom !== undefined && (!Number.isFinite(priceFrom) || priceFrom < 0)) ||
 (priceTo !== undefined && (!Number.isFinite(priceTo) || priceTo < 0))
 ) {
 setError("Mức giá không hợp lệ.");
 return;
 }
 if (
 priceFrom !== undefined &&
 priceTo !== undefined &&
 priceTo < priceFrom
 ) {
 setError("Giá đến không được nhỏ hơn giá từ.");
 return;
 }

 const body = {
 name,
 maDiaDiem: placeId,
 moTa: form.description.trim() || undefined,
 diaChi: form.address.trim() || undefined,
 giaTu: priceFrom,
 giaDen: priceTo,
 anhDaiDien: form.imageUrl.trim() || undefined,
 trangThai: form.status,
 };

 try {
 const result = isEdit
 ? await updateService({
 category: form.category,
 id: serviceId,
 body,
 }).unwrap()
 : await createService({
 category: form.category,
 body,
 }).unwrap();

 if (result?.success === false) {
 throw new Error(result.message ?? "Không thể lưu dịch vụ.");
 }

 toast({
 title: isEdit ? "Đã cập nhật dịch vụ" : "Đã tạo dịch vụ",
 description: "Dữ liệu dịch vụ đã được lưu vào hệ thống.",
 variant: "success",
 });
 navigate(PROVIDER_APPROVED_ROUTES.SERVICES);
 } catch (err) {
 const message =
 err?.data?.message ??
 err?.message ??
 "Không thể lưu dịch vụ. Vui lòng thử lại.";
 setError(message);
 }
 };

 if (isEdit && isLoadingServices) {
 return (
 <div className="flex min-h-[50vh] items-center justify-center">
 <Loader2 className="h-7 w-7 animate-spin text-primary" />
 </div>
 );
 }

 if (isEdit && (isServicesError || !existingService)) {
 return (
 <div className="mx-auto max-w-3xl py-8">
 <Link
 to={PROVIDER_APPROVED_ROUTES.SERVICES}
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 Quay lại danh sách
 </Link>
 <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
 Không tìm thấy dịch vụ thuộc tài khoản hiện tại.{" "}
 <button type="button" className="font-semibold underline" onClick={() => refetchServices()}>
 Tải lại
 </button>
 </div>
 </div>
 );
 }

 const canSubmit =
 form.name.trim().length >= 2 &&
 Number(form.placeId) > 0 &&
 !isSubmitting;

 return (
 <div className="mx-auto max-w-5xl py-2 pb-10">
 <Link
 to={PROVIDER_APPROVED_ROUTES.SERVICES}
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 Quay lại danh sách
 </Link>

 <div className="mb-7">
 <h1 className="text-2xl font-bold text-foreground">
 {isEdit ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
 </h1>
 <p className="mt-2 text-sm text-muted-foreground">
 Thông tin được lưu trực tiếp vào danh sách dịch vụ của doanh nghiệp.
 </p>
 </div>

 <form className="grid gap-7 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
 <main className="space-y-8">
 {error && (
 <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <section>
 <div className="flex items-center gap-3">
 <Building2 className="h-5 w-5 text-primary" />
 <h2 className="text-lg font-bold text-foreground">Thông tin cơ bản</h2>
 </div>
 <div className="mt-5 grid gap-5 sm:grid-cols-2">
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="service-category">
 Nhóm dịch vụ
 </label>
 <select
 id="service-category"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
 value={form.category}
 onChange={updateField("category")}
 disabled={isSubmitting}
 >
 {categories.map((category) => (
 <option key={category.value} value={category.value}>
 {category.label}
 </option>
 ))}
 </select>
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="service-status">
 Trạng thái
 </label>
 <select
 id="service-status"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
 value={form.status}
 onChange={updateField("status")}
 disabled={isSubmitting}
 >
 <option value="ACTIVE">Đang hoạt động</option>
 <option value="INACTIVE">Tạm ẩn</option>
 <option value="PENDING">Chờ duyệt</option>
 </select>
 </div>
 <div className="sm:col-span-2">
 <label className="text-sm font-semibold text-foreground" htmlFor="service-name">
 Tên dịch vụ
 </label>
 <input
 id="service-name"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
 value={form.name}
 onChange={updateField("name")}
 disabled={isSubmitting}
 maxLength={300}
 placeholder="Ví dụ: Khách sạn Biển Xanh"
 required
 />
 </div>
 <div className="sm:col-span-2">
 <label className="text-sm font-semibold text-foreground" htmlFor="service-description">
 Mô tả
 </label>
 <textarea
 id="service-description"
 className="mt-2 min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none focus:border-primary"
 value={form.description}
 onChange={updateField("description")}
 disabled={isSubmitting}
 maxLength={2000}
 placeholder="Tiện nghi, điểm nổi bật và thông tin khách cần biết"
 />
 </div>
 </div>
 </section>

 <section className="border-t pt-7">
 <div className="flex items-center gap-3">
 <MapPin className="h-5 w-5 text-primary" />
 <h2 className="text-lg font-bold text-foreground">Địa điểm</h2>
 </div>
 <div className="relative mt-5">
 <label className="text-sm font-semibold text-foreground" htmlFor="service-place">
 Tìm và chọn địa điểm
 </label>
 <div className="relative mt-2">
 <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="service-place"
 className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
 value={placeKeyword}
 onChange={handlePlaceChange}
 onFocus={() => setShowPlaces(true)}
 disabled={isSubmitting}
 placeholder="Nhập tên địa điểm hoặc tỉnh thành"
 autoComplete="off"
 required
 />
 {isSearchingPlaces && (
 <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-muted-foreground" />
 )}
 </div>

 {showPlaces && placeKeyword.trim().length >= 2 && (
 <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-background p-1 shadow-lg">
 {isPlaceSearchError ? (
 <p className="px-3 py-4 text-sm text-red-600">Không thể tìm địa điểm.</p>
 ) : !isSearchingPlaces && places.length === 0 ? (
 <p className="px-3 py-4 text-sm text-muted-foreground">Không tìm thấy địa điểm phù hợp.</p>
 ) : (
 places.map((place) => (
 <button
 key={getPlaceId(place)}
 type="button"
 className="block w-full rounded px-3 py-2 text-left hover:bg-muted"
 onClick={() => selectPlace(place)}
 >
 <span className="block text-sm font-semibold text-foreground">
 {getPlaceName(place)}
 </span>
 <span className="mt-0.5 block text-xs text-muted-foreground">
 {getPlaceAddress(place) || `Mã địa điểm ${getPlaceId(place)}`}
 </span>
 </button>
 ))
 )}
 </div>
 )}

 {form.placeId && (
 <p className="mt-2 text-xs font-semibold text-emerald-600">
 Đã chọn địa điểm #{form.placeId}
 </p>
 )}
 </div>

 <div className="mt-5">
 <label className="text-sm font-semibold text-foreground" htmlFor="service-address">
 Địa chỉ cụ thể
 </label>
 <input
 id="service-address"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
 value={form.address}
 onChange={updateField("address")}
 disabled={isSubmitting}
 maxLength={255}
 placeholder="Số nhà, đường, phường/xã"
 />
 </div>
 </section>

 <section className="border-t pt-7">
 <div className="flex items-center gap-3">
 <Wallet className="h-5 w-5 text-primary" />
 <h2 className="text-lg font-bold text-foreground">Mức giá</h2>
 </div>
 <div className="mt-5 grid gap-5 sm:grid-cols-2">
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="service-price-from">
 Giá từ
 </label>
 <div className="relative mt-2">
 <input
 id="service-price-from"
 className="h-11 w-full rounded-md border bg-background px-3 pr-14 text-sm outline-none focus:border-primary"
 value={form.priceFrom}
 onChange={updateField("priceFrom")}
 disabled={isSubmitting}
 min="0"
 step="1000"
 type="number"
 />
 <span className="absolute right-3 top-3 text-sm text-muted-foreground">VND</span>
 </div>
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="service-price-to">
 Giá đến
 </label>
 <div className="relative mt-2">
 <input
 id="service-price-to"
 className="h-11 w-full rounded-md border bg-background px-3 pr-14 text-sm outline-none focus:border-primary"
 value={form.priceTo}
 onChange={updateField("priceTo")}
 disabled={isSubmitting}
 min="0"
 step="1000"
 type="number"
 />
 <span className="absolute right-3 top-3 text-sm text-muted-foreground">VND</span>
 </div>
 </div>
 </div>
 </section>
 </main>

 <aside className="space-y-5">
 <div className="rounded-md border bg-background p-4 shadow-sm">
 <h2 className="text-sm font-bold text-foreground">Ảnh đại diện</h2>
 <div className="mt-3 overflow-hidden rounded-md border bg-muted/40">
 {form.imageUrl.trim() ? (
 <img src={form.imageUrl.trim()}
 alt="Service preview"
 className="h-44 w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
 <ImageIcon className="h-7 w-7" />
 Chưa có ảnh
 </div>
 )}
 </div>
 <input
 className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
 value={form.imageUrl}
 onChange={updateField("imageUrl")}
 disabled={isSubmitting}
 placeholder="https://..."
 type="url"
 />
 </div>

 <div className="flex gap-3">
 <Link
 to={PROVIDER_APPROVED_ROUTES.SERVICES}
 className="inline-flex h-11 flex-1 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
 >
 Hủy
 </Link>
 <button
 type="submit"
 className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
 disabled={!canSubmit}
 >
 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
 Lưu
 </button>
 </div>
 </aside>
 </form>
 </div>
 );
}
