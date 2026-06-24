import { Loader2, RefreshCw, CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useGetPaymentHistoryQuery } from "../../store/apis/providerApi";

const formatDate = (value) => {
 if (!value) return "—";
 const date = new Date(value);
 return Number.isNaN(date.getTime())
 ? "—"
 : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatMoney = (value) =>
 new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 maximumFractionDigits: 0,
 }).format(Number(value) || 0);

const STATUS_CONFIG = {
 SUCCESS: { label: "Thành công", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
 COMPLETED: { label: "Hoàn thành", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
 PENDING: { label: "Đang xử lý", icon: Clock, className: "text-amber-700 bg-amber-50 border-amber-200" },
 FAILED: { label: "Thất bại", icon: XCircle, className: "text-red-700 bg-red-50 border-red-200" },
 CANCELLED: { label: "Đã hủy", icon: XCircle, className: "text-muted-foreground bg-background border-border" },
};

function StatusBadge({ status }) {
 const key = String(status ?? "").toUpperCase();
 const config = STATUS_CONFIG[key] ?? { label: key || "Không rõ", icon: Clock, className: "text-muted-foreground bg-background border-border" };
 const Icon = config.icon;
 return (
 <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
 <Icon className="h-3.5 w-3.5" aria-hidden="true" />
 {config.label}
 </span>
 );
}

export default function ProviderBilling() {
 const { data, isLoading, isError, refetch } = useGetPaymentHistoryQuery();
 const payments = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];

 const totalSuccessful = payments
 .filter((p) => ["SUCCESS", "COMPLETED"].includes(String(p.status ?? "").toUpperCase()))
 .reduce((sum, p) => sum + Number(p.amount ?? p.soTien ?? 0), 0);

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Lịch sử giao dịch</h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Toàn bộ lịch sử thanh toán gói dịch vụ của tài khoản Provider.
 </p>
 </div>
 <button
 type="button"
 onClick={() => refetch()}
 className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
 >
 <RefreshCw className="h-4 w-4" />
 Làm mới
 </button>
 </div>

 {/* Summary card */}
 {!isLoading && !isError && payments.length > 0 && (
 <div className="grid gap-4 sm:grid-cols-3">
 <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tổng giao dịch</p>
 <p className="mt-2 text-2xl font-bold text-foreground">{payments.length}</p>
 </div>
 <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
 <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Tổng đã thanh toán</p>
 <p className="mt-2 text-2xl font-bold text-emerald-700">{formatMoney(totalSuccessful)}</p>
 </div>
 <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phương thức</p>
 <p className="mt-2 text-2xl font-bold text-foreground">
 <CreditCard className="inline h-5 w-5 text-primary" /> Mô phỏng
 </p>
 </div>
 </div>
 )}

 {/* Table */}
 {isLoading ? (
 <div className="flex min-h-64 items-center justify-center" role="status">
 <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
 <span className="sr-only">Đang tải lịch sử giao dịch</span>
 </div>
 ) : isError ? (
 <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
 Không thể tải lịch sử giao dịch.{" "}
 <button type="button" className="font-semibold underline" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 ) : payments.length === 0 ? (
 <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-background text-sm text-muted-foreground">
 <CreditCard className="h-8 w-8 text-slate-300" />
 <p className="font-semibold">Chưa có giao dịch nào</p>
 <p className="text-xs">Kích hoạt gói dịch vụ để bắt đầu ghi nhận lịch sử thanh toán.</p>
 </div>
 ) : (
 <div className="overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted-foreground">
 <tr>
 <th className="px-5 py-3.5">Mã GD</th>
 <th className="px-5 py-3.5">Gói</th>
 <th className="px-5 py-3.5">Ngày</th>
 <th className="px-5 py-3.5 text-right">Số tiền</th>
 <th className="px-5 py-3.5">Trạng thái</th>
 <th className="px-5 py-3.5">Phương thức</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {payments.map((payment) => {
 const id = payment.id ?? payment.maThanhToan ?? payment.transactionId;
 return (
 <tr key={id} className="transition hover:bg-background/60">
 <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
 #{String(id).slice(-8).toUpperCase()}
 </td>
 <td className="px-5 py-4 font-medium text-foreground">
 {payment.packageName ?? payment.tenGoi ?? "—"}
 </td>
 <td className="px-5 py-4 text-muted-foreground">
 {formatDate(payment.createdAt ?? payment.ngayThanhToan)}
 </td>
 <td className="px-5 py-4 text-right font-semibold text-foreground">
 {formatMoney(payment.amount ?? payment.soTien)}
 </td>
 <td className="px-5 py-4">
 <StatusBadge status={payment.status ?? payment.trangThai} />
 </td>
 <td className="px-5 py-4 text-xs text-muted-foreground">
 {payment.paymentMethod ?? payment.phuongThuc ?? "Mô phỏng"}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}

 {/* Disclaimer */}
 <p className="text-center text-xs text-muted-foreground">
 * Đây là môi trường demo — giao dịch được mô phỏng, không phát sinh chi phí thực.
 </p>
 </div>
 );
}