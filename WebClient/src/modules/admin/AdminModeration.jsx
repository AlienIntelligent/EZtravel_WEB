import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { downloadProviderDocument } from "../../api/providerDocuments";
import {
  useGetModerationItemsQuery,
  useGetPendingProvidersQuery,
  useResolveModerationItemMutation,
  useUpdateProviderStatusMutation,
} from "../../store/apis/adminApi";

const formatDate = (value) => {
  if (!value) return "Chua cap nhat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chua cap nhat";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getReportId = (item) => item?.id ?? item?.maBaoCao;
const getProviderId = (item) => item?.id ?? item?.providerId ?? item?.maNhaCungCap;

export default function AdminModeration() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reports");
  const {
    data: reports = [],
    isLoading: isLoadingReports,
    isError: isReportsError,
    refetch: refetchReports,
  } = useGetModerationItemsQuery();
  const {
    data: providers = [],
    isLoading: isLoadingProviders,
    isError: isProvidersError,
    refetch: refetchProviders,
  } = useGetPendingProvidersQuery();
  const [resolveReport, { isLoading: isResolving }] =
    useResolveModerationItemMutation();
  const [updateProviderStatus, { isLoading: isUpdatingProvider }] =
    useUpdateProviderStatusMutation();
  const [workingId, setWorkingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleReport = async (item, action) => {
    const id = getReportId(item);
    if (!id) return;
    setWorkingId(`report-${id}`);
    try {
      await resolveReport({ id, body: { action } }).unwrap();
      toast({
        title: action === "APPROVE" ? "Da xu ly bao cao" : "Da bo qua bao cao",
        description: "Hang doi moderation da duoc cap nhat.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Khong the xu ly bao cao",
        description: err?.data?.message ?? "Vui long thu lai.",
        variant: "error",
      });
    } finally {
      setWorkingId(null);
    }
  };

  const handleProvider = async (provider, status) => {
    const id = getProviderId(provider);
    if (!id) return;
    const actionLabel = status === "APPROVED" ? "phe duyet" : "tu choi";
    if (!window.confirm(`Xac nhan ${actionLabel} nha cung cap nay?`)) return;

    setWorkingId(`provider-${id}`);
    try {
      await updateProviderStatus({ id, body: { status } }).unwrap();
      toast({
        title: status === "APPROVED" ? "Da phe duyet nha cung cap" : "Da tu choi ho so",
        description: "Trang thai provider va tai khoan lien quan da duoc cap nhat.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Khong the cap nhat provider",
        description: err?.data?.message ?? "Vui long thu lai.",
        variant: "error",
      });
    } finally {
      setWorkingId(null);
    }
  };

  const handleDocumentDownload = async (document) => {
    const id = document.id ?? document.documentId;
    setDownloadingId(id);
    try {
      await downloadProviderDocument(id, document.originalFileName);
    } catch (err) {
      toast({
        title: "Khong the tai giay to",
        description: err?.response?.data?.message ?? "Vui long thu lai.",
        variant: "error",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Moderation</h1>
          <p className="mt-2 text-sm text-slate-500">
            Xu ly bao cao noi dung va ho so nha cung cap dang cho duyet.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={() => {
            refetchReports();
            refetchProviders();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Lam moi
        </button>
      </div>

      <div className="inline-flex rounded-md bg-slate-200/70 p-1">
        <button
          type="button"
          className={`inline-flex h-10 items-center gap-2 rounded px-4 text-sm font-semibold ${
            activeTab === "reports"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-600"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          <AlertTriangle className="h-4 w-4" />
          Bao cao
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{reports.length}</span>
        </button>
        <button
          type="button"
          className={`inline-flex h-10 items-center gap-2 rounded px-4 text-sm font-semibold ${
            activeTab === "providers"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-600"
          }`}
          onClick={() => setActiveTab("providers")}
        >
          <Building2 className="h-4 w-4" />
          Nha cung cap
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{providers.length}</span>
        </button>
      </div>

      {activeTab === "reports" ? (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">Bao cao dang cho xu ly</h2>
            <p className="mt-1 text-sm text-slate-500">Toi da 100 bao cao cu nhat trong hang doi.</p>
          </div>

          {isLoadingReports ? (
            <LoadingState />
          ) : isReportsError ? (
            <ErrorState label="Khong the tai hang doi moderation." onRetry={refetchReports} />
          ) : reports.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="Khong co bao cao dang cho"
              description="Hang doi moderation hien da duoc xu ly het."
            />
          ) : (
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <div className="divide-y divide-slate-200">
                {reports.map((item) => {
                  const id = getReportId(item);
                  const isWorking = workingId === `report-${id}` && isResolving;
                  return (
                    <article key={id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                            {item.targetType ?? "UNKNOWN"}
                          </span>
                          <span className="text-xs text-slate-500">
                            #{item.targetId ?? "N/A"} · {formatDate(item.createdAt ?? item.ngayBaoCao)}
                          </span>
                        </div>
                        <h3 className="mt-3 font-bold text-slate-950">
                          {item.targetTitle || `Noi dung #${item.targetId ?? id}`}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.reason ?? item.lyDo ?? "Khong co ly do chi tiet."}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Nguoi bao cao: {item.reporterName || `#${item.reporterId ?? item.maNguoiBaoCao}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                          onClick={() => handleReport(item, "REJECT")}
                          disabled={isResolving}
                        >
                          <XCircle className="h-4 w-4" />
                          Bo qua
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                          onClick={() => handleReport(item, "APPROVE")}
                          disabled={isResolving}
                        >
                          {isWorking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Da xu ly
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">Nha cung cap cho duyet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Phe duyet se kich hoat khu Provider va cap nhat vai tro tai khoan.
            </p>
          </div>

          {isLoadingProviders ? (
            <LoadingState />
          ) : isProvidersError ? (
            <ErrorState label="Khong the tai danh sach provider." onRetry={refetchProviders} />
          ) : providers.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Khong co ho so dang cho"
              description="Tat ca ho so nha cung cap hien da duoc xu ly."
            />
          ) : (
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <div className="divide-y divide-slate-200">
                {providers.map((provider) => {
                  const id = getProviderId(provider);
                  const isWorking = workingId === `provider-${id}` && isUpdatingProvider;
                  const documents = Array.isArray(provider.documents) ? provider.documents : [];
                  return (
                    <article key={id} className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                            {provider.status ?? provider.trangThai ?? "PENDING"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(provider.createdAt)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-slate-950">
                          {provider.businessName ?? provider.tenDoanhNghiep}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                          <span>Nguoi dang ky: {provider.applicantName || `#${provider.userId}`}</span>
                          <span>{provider.email}</span>
                          {provider.phone && <span>{provider.phone}</span>}
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          Loai: {provider.providerType ?? provider.loaiNhaCungCap ?? "MULTI_SERVICE"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                          <span>Ma so thue: {provider.taxCode || "Chua cap nhat"}</span>
                          <span>Giay phep: {provider.licenseNumber || "Chua cap nhat"}</span>
                          {provider.address && <span>Dia chi: {provider.address}</span>}
                        </div>

                        {documents.length === 0 ? (
                          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                            Chua co giay to xac minh. Khong the phe duyet ho so nay.
                          </div>
                        ) : (
                          <div className="mt-4 divide-y rounded-md border border-slate-200">
                            {documents.map((document) => {
                              const documentId = document.id ?? document.documentId;
                              return (
                                <div key={documentId} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                                    <div className="min-w-0">
                                      <p className="truncate text-xs font-semibold text-slate-800">{document.originalFileName}</p>
                                      <p className="mt-0.5 text-[11px] text-slate-500">
                                        {document.documentType} · {document.status}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                                    onClick={() => handleDocumentDownload(document)}
                                    disabled={downloadingId === documentId}
                                  >
                                    {downloadingId === documentId ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Download className="h-3.5 w-3.5" />
                                    )}
                                    Tai xuong
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                          onClick={() => handleProvider(provider, "REJECTED")}
                          disabled={isUpdatingProvider}
                        >
                          <XCircle className="h-4 w-4" />
                          Tu choi
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          onClick={() => handleProvider(provider, "APPROVED")}
                          disabled={isUpdatingProvider || documents.length === 0}
                          title={documents.length === 0 ? "Can co giay to xac minh truoc khi phe duyet" : undefined}
                        >
                          {isWorking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Phe duyet
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-md border border-slate-200 bg-white">
      <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
    </div>
  );
}

function ErrorState({ label, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <span>{label}</span>
      <button type="button" className="font-semibold underline" onClick={() => onRetry()}>
        Thu lai
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-5 py-12 text-center">
      <Icon className="mx-auto h-8 w-8 text-slate-400" />
      <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
