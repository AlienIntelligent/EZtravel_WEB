import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, FileCheck2, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { baseApi } from "../../api/baseApi";
import { useAppDispatch } from "../../store/hooks";
import {
 useGetProviderStatusQuery,
 useRegisterProviderMutation,
} from "../../store/apis/providerApi";
import {
 PROVIDER_APPROVED_ROUTES,
 PROVIDER_PENDING_ROUTES,
} from "../../router/routes";

const initialForm = {
 businessName: "",
 taxCode: "",
 licenseNumber: "",
 phone: "",
 address: "",
};

const normalizeStatus = (provider) =>
 String(provider?.status ?? provider?.trangThai ?? "").toUpperCase();

export default function ProviderRegistration() {
 const navigate = useNavigate();
 const dispatch = useAppDispatch();
 const { toast } = useToast();
 const {
 data: providerStatus,
 isLoading: isLoadingStatus,
 isError: isStatusError,
 refetch,
 } = useGetProviderStatusQuery();
 const [registerProvider, { isLoading: isRegistering }] = useRegisterProviderMutation();
 const [form, setForm] = useState(initialForm);
 const [confirmed, setConfirmed] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!providerStatus?.registered) return;
 const status = normalizeStatus(providerStatus);
 navigate(
 status === "ACTIVE" || status === "APPROVED"
 ? PROVIDER_APPROVED_ROUTES.DASHBOARD
 : PROVIDER_PENDING_ROUTES.PENDING,
 { replace: true },
 );
 }, [navigate, providerStatus]);

 const updateField = (field, value) => {
 setForm((current) => ({ ...current, [field]: value }));
 if (error) setError("");
 };

 const handleSubmit = async (event) => {
 event.preventDefault();
 const payload = Object.fromEntries(
 Object.entries(form).map(([key, value]) => [key, value.trim()]),
 );

 if (payload.businessName.length < 2) {
 setError("Ten doanh nghiep can it nhat 2 ky tu.");
 return;
 }
 if (payload.taxCode.length < 3 || payload.licenseNumber.length < 3) {
 setError("Ma so thue va so giay phep la thong tin bat buoc.");
 setError("Mã số thuế và số giấy phép là thông tin bắt buộc.");
 return;
 }
 if (payload.phone.length < 8 || payload.address.length < 5) {
 setError("Số điện thoại hoặc địa chỉ doanh nghiệp chưa hợp lệ.");
 return;
 }
 if (!confirmed) {
 setError("Bạn cần xác nhận thông tin đăng ký là chính xác.");
 return;
 }

 try {
 const result = await registerProvider(payload).unwrap();
 if (result?.success === false) {
 throw new Error(result.message ?? "Không thể đăng ký nhà cung cấp.");
 }

 dispatch(baseApi.util.invalidateTags(["User", "Provider"]));
 toast({
 title: "Đã tạo hồ sơ doanh nghiệp",
 description: "Bước tiếp theo là nộp giấy tờ xác minh trên trang chờ duyệt.",
 variant: "success",
 });
 navigate(PROVIDER_PENDING_ROUTES.PENDING, { replace: true });
 } catch (err) {
 setError(
 err?.data?.message ??
 err?.message ??
 "Không thể đăng ký nhà cung cấp. Vui lòng thử lại.",
 );
 }
 };

 if (isLoadingStatus) {
 return (
 <div className="container mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-4">
 <Loader2 className="h-7 w-7 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <div className="container mx-auto max-w-5xl px-4 py-8 pb-14">
 <div className="mb-8">
 <p className="text-sm font-semibold text-primary">Khu vực đối tác</p>
 <h1 className="mt-2 text-3xl font-bold text-foreground">Đăng ký nhà cung cấp</h1>
 <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
 Tạo hồ sơ pháp lý của doanh nghiệp. Giấy tờ xác minh sẽ được nộp ở bước kế tiếp.
 </p>
 </div>

 {isStatusError && (
 <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
 <span>Không thể kiểm tra hồ sơ hiện tại.</span>
 <button type="button" className="font-semibold underline" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 )}

 <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
 <form className="space-y-7" onSubmit={handleSubmit}>
 <section>
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
 <Building2 className="h-5 w-5" />
 </div>
 <div>
 <h2 className="text-lg font-bold text-foreground">Thông tin doanh nghiệp</h2>
 <p className="text-sm text-muted-foreground">Thông tin này sẽ được Admin đối chiếu với giấy tờ.</p>
 </div>
 </div>

 <div className="mt-6 grid gap-5 sm:grid-cols-2">
 <FormField
 id="provider-business-name"
 label="Tên doanh nghiệp"
 value={form.businessName}
 onChange={(value) => updateField("businessName", value)}
 placeholder="Công ty Du lịch Biển Xanh"
 className="sm:col-span-2"
 maxLength={255}
 disabled={isRegistering}
 />
 <FormField
 id="provider-tax-code"
 label="Mã số thuế"
 value={form.taxCode}
 onChange={(value) => updateField("taxCode", value)}
 placeholder="0101234567"
 maxLength={50}
 disabled={isRegistering}
 />
 <FormField
 id="provider-license-number"
 label="Số giấy phép"
 value={form.licenseNumber}
 onChange={(value) => updateField("licenseNumber", value)}
 placeholder="GP-2026-001"
 maxLength={100}
 disabled={isRegistering}
 />
 <FormField
 id="provider-phone"
 label="Số điện thoại liên hệ"
 value={form.phone}
 onChange={(value) => updateField("phone", value)}
 placeholder="0901234567"
 maxLength={20}
 disabled={isRegistering}
 />
 <FormField
 id="provider-address"
 label="Địa chỉ doanh nghiệp"
 value={form.address}
 onChange={(value) => updateField("address", value)}
 placeholder="Quận Hải Châu, Đà Nẵng"
 className="sm:col-span-2"
 maxLength={500}
 disabled={isRegistering}
 />
 </div>
 </section>

 <section className="border-t pt-7">
 <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
 <input
 className="mt-1 h-4 w-4 accent-primary"
 type="checkbox"
 checked={confirmed}
 onChange={(event) => {
 setConfirmed(event.target.checked);
 if (error) setError("");
 }}
 />
 <span>
 Tôi xác nhận thông tin pháp lý là chính xác và chấp nhận quy trình kiểm duyệt đối tác.
 </span>
 </label>
 </section>

 {error && (
 <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <div className="flex flex-wrap gap-3">
 <Link
 to="/dashboard"
 className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-5 text-sm font-semibold text-foreground hover:bg-muted"
 >
 Quay lại
 </Link>
 <button
 type="submit"
 className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
 disabled={isRegistering || !confirmed}
 >
 {isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
 Tạo hồ sơ
 </button>
 </div>
 </form>

 <aside className="h-fit rounded-md border bg-background p-5 shadow-sm">
 <div className="flex items-center gap-3">
 <FileCheck2 className="h-5 w-5 text-primary" />
 <h2 className="font-bold text-foreground">Quy trình xác minh</h2>
 </div>
 <div className="mt-5 space-y-4 text-sm text-muted-foreground">
 {[
 "Tạo hồ sơ với thông tin pháp lý của doanh nghiệp.",
 "Nộp bản PDF/JPG/PNG của giấy phép, tối đa 5 MB.",
 "Admin xem giấy tờ trước khi kích hoạt khu Provider.",
 ].map((item) => (
 <p key={item} className="flex items-start gap-2 leading-6">
 <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
 {item}
 </p>
 ))}
 </div>
 </aside>
 </div>
 </div>
 );
}

function FormField({ id, label, value, onChange, placeholder, className = "", ...inputProps }) {
 return (
 <div className={className}>
 <label className="text-sm font-semibold text-foreground" htmlFor={id}>{label}</label>
 <input
 id={id}
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 value={value}
 onChange={(event) => onChange(event.target.value)}
 placeholder={placeholder}
 required
 {...inputProps}
 />
 </div>
 );
}
