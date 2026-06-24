import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 Building2,
 CalendarDays,
 CircleAlert,
 Clock3,
 Download,
 FileCheck2,
 FileText,
 Loader2,
 RefreshCw,
 ShieldCheck,
 Upload,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { baseApi } from "../../api/baseApi";
import { downloadProviderDocument } from "../../api/providerDocuments";
import { useAppDispatch } from "../../store/hooks";
import {
 useGetProviderStatusQuery,
 useUploadDocsMutation,
} from "../../store/apis/providerApi";
import { AUTH_ROUTES, PROVIDER_APPROVED_ROUTES } from "../../router/routes";

const documentLabels = {
 BUSINESS_LICENSE: "Giấy phép kinh doanh",
 TAX_REGISTRATION: "Đăng ký mã số thuế",
 IDENTITY: "Giấy tờ người đại diện",
};

const normalizeStatus = (provider) =>
 String(provider?.status ?? provider?.trangThai ?? "PENDING").toUpperCase();

const formatDate = (value) => {
 if (!value) return "Chưa cập nhật";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
 return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

const formatFileSize = (value) => {
 const bytes = Number(value) || 0;
 if (bytes < 1024) return `${bytes} B`;
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
 return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function ProviderPending() {
 const navigate = useNavigate();
 const dispatch = useAppDispatch();
 const { toast } = useToast();
 const fileInputRef = useRef(null);
 const {
 data: provider,
 isLoading,
 isFetching,
 isError,
 refetch,
 } = useGetProviderStatusQuery(undefined, { pollingInterval: 30000 });
 const [uploadDocument, { isLoading: isUploading }] = useUploadDocsMutation();
 const [documentType, setDocumentType] = useState("BUSINESS_LICENSE");
 const [file, setFile] = useState(null);
 const [formError, setFormError] = useState("");
 const [downloadingId, setDownloadingId] = useState(null);
 const status = normalizeStatus(provider);
 const isRejected = status === "REJECTED" || status === "INACTIVE";
 const documents = Array.isArray(provider?.documents) ? provider.documents : [];

 useEffect(() => {
 if (!provider) return;
 if (!provider.registered) {
 navigate(AUTH_ROUTES.PROVIDER_REGISTRATION, { replace: true });
 return;
 }

 if (status === "ACTIVE" || status === "APPROVED") {
 dispatch(baseApi.util.invalidateTags(["User", "Provider"]));
 navigate(PROVIDER_APPROVED_ROUTES.DASHBOARD, { replace: true });
 }
 }, [dispatch, navigate, provider, status]);

 const handleUpload = async (event) => {
 event.preventDefault();
 if (!file) {
 setFormError("Cần chọn một tệp hồ sơ.");
 return;
 }
 if (file.size > 5 * 1024 * 1024) {
 setFormError("Tệp hồ sơ không được vượt quá 5 MB.");
 return;
 }

 try {
 await uploadDocument({ documentType, file }).unwrap();
 setFile(null);
 setFormError("");
 if (fileInputRef.current) fileInputRef.current.value = "";
 await refetch();
 toast({
 title: "Đã nộp giấy tờ",
 description: "Hồ sơ mới đã được lưu và chuyển về hàng đợi phê duyệt.",
 variant: "success",
 });
 } catch (err) {
 setFormError(err?.data?.message ?? "Không thể tải giấy tờ lên. Vui lòng thử lại.");
 }
 };

 const handleDownload = async (document) => {
 const id = document.id ?? document.documentId;
 setDownloadingId(id);
 try {
 await downloadProviderDocument(id, document.originalFileName);
 } catch (err) {
 toast({
 title: "Không thể tải giấy tờ",
 description: err?.response?.data?.message ?? "Vui lòng thử lại.",
 variant: "error",
 });
 } finally {
 setDownloadingId(null);
 }
 };

 if (isLoading) {
 return (
 <div className="container mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-4">
 <Loader2 className="h-7 w-7 animate-spin text-primary" />
 </div>
 );
 }

 if (isError || !provider) {
 return (
 <div className="container mx-auto max-w-3xl px-4 py-12">
 <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
 Không thể tải trạng thái hồ sơ.{" "}
 <button type="button" className="font-semibold underline" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="container mx-auto max-w-4xl px-4 py-10 pb-16">
 <section className="text-center">
 <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
 isRejected ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
 }`}>
 {isRejected ? <CircleAlert className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}
 </div>
 <h1 className="mt-5 text-3xl font-bold text-foreground">
 {isRejected ? "Hồ sơ cần được cập nhật" : "Hồ sơ đang chờ phê duyệt"}
 </h1>
 <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
 {isRejected
 ? "Bạn có thể nộp lại giấy tờ bên dưới. Hồ sơ sẽ tự động quay về hàng đợi phê duyệt."
 : "ezTravel kiểm tra trạng thái tự động mỗi 30 giây. Bạn vẫn có thể bổ sung hoặc thay thế giấy tờ."}
 </p>
 </section>

 <section className="mx-auto mt-9 max-w-2xl rounded-md border bg-background p-6 shadow-sm">
 <div className="flex items-center justify-between gap-4 border-b pb-5">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
 <Building2 className="h-5 w-5" />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase text-muted-foreground">Doanh nghiệp</p>
 <h2 className="mt-1 font-bold text-foreground">
 {provider.businessName ?? provider.tenDoanhNghiep ?? "Nhà cung cấp"}
 </h2>
 </div>
 </div>
 <span className={`rounded px-2.5 py-1 text-xs font-bold ${
 isRejected ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
 }`}>
 {status}
 </span>
 </div>

 <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
 <div>
 <dt className="inline-flex items-center gap-2 text-muted-foreground">
 <ShieldCheck className="h-4 w-4" /> Mã hồ sơ
 </dt>
 <dd className="mt-1 font-semibold text-foreground">#{provider.providerId ?? provider.maNhaCungCap}</dd>
 </div>
 <div>
 <dt className="inline-flex items-center gap-2 text-muted-foreground">
 <CalendarDays className="h-4 w-4" /> Ngày gửi
 </dt>
 <dd className="mt-1 font-semibold text-foreground">{formatDate(provider.createdAt)}</dd>
 </div>
 </dl>

 <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">
 <button
 type="button"
 className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
 onClick={() => refetch()}
 disabled={isFetching}
 >
 <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
 Kiểm tra lại
 </button>
 <Link
 to={AUTH_ROUTES.PROFILE}
 className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
 >
 Xem hồ sơ cá nhân
 </Link>
 </div>
 </section>

 <section className="mx-auto mt-6 max-w-2xl rounded-md border bg-background p-6 shadow-sm">
 <div className="flex items-center gap-3">
 <FileCheck2 className="h-5 w-5 text-primary" />
 <div>
 <h2 className="font-bold text-foreground">Giấy tờ xác minh</h2>
 <p className="mt-1 text-sm text-muted-foreground">PDF, JPG hoặc PNG; tối đa 5 MB mỗi tệp.</p>
 </div>
 </div>

 {documents.length === 0 ? (
 <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
 Cần nộp ít nhất một giấy tờ trước khi Admin có thể phê duyệt.
 </div>
 ) : (
 <div className="mt-5 divide-y rounded-md border">
 {documents.map((document) => {
 const id = document.id ?? document.documentId;
 return (
 <div key={id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex min-w-0 items-start gap-3">
 <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
 <div className="min-w-0">
 <p className="truncate text-sm font-semibold text-foreground">{document.originalFileName}</p>
 <p className="mt-1 text-xs text-muted-foreground">
 {documentLabels[document.documentType] ?? document.documentType} · {formatFileSize(document.fileSize)} · {document.status}
 </p>
 </div>
 </div>
 <button
 type="button"
 className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold hover:bg-muted disabled:opacity-60"
 onClick={() => handleDownload(document)}
 disabled={downloadingId === id}
 >
 {downloadingId === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
 Tải xuống
 </button>
 </div>
 );
 })}
 </div>
 )}

 <form className="mt-6 grid gap-4 border-t pt-5" onSubmit={handleUpload}>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label htmlFor="provider-document-type" className="text-sm font-semibold text-foreground">Loại giấy tờ</label>
 <select
 id="provider-document-type"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm"
 value={documentType}
 onChange={(event) => setDocumentType(event.target.value)}
 disabled={isUploading}
 >
 {Object.entries(documentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
 </select>
 </div>
 <div>
 <label htmlFor="provider-document-file" className="text-sm font-semibold text-foreground">Tệp hồ sơ</label>
 <input
 ref={fileInputRef}
 id="provider-document-file"
 type="file"
 accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
 className="mt-2 block h-11 w-full rounded-md border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold"
 onChange={(event) => {
 setFile(event.target.files?.[0] ?? null);
 if (formError) setFormError("");
 }}
 disabled={isUploading}
 />
 </div>
 </div>

 {formError && <p className="text-sm text-red-600">{formError}</p>}

 <button
 type="submit"
 className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
 disabled={isUploading || !file}
 >
 {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
 {documents.some((item) => item.documentType === documentType) ? "Thay the giay to" : "Nop giay to"}
 </button>
 </form>
 </section>
 </div>
 );
}
