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
  BUSINESS_LICENSE: "Giay phep kinh doanh",
  TAX_REGISTRATION: "Dang ky ma so thue",
  IDENTITY: "Giay to nguoi dai dien",
};

const normalizeStatus = (provider) =>
  String(provider?.status ?? provider?.trangThai ?? "PENDING").toUpperCase();

const formatDate = (value) => {
  if (!value) return "Chua cap nhat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chua cap nhat";
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
      setFormError("Can chon mot tep ho so.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Tep ho so khong duoc vuot qua 5 MB.");
      return;
    }

    try {
      await uploadDocument({ documentType, file }).unwrap();
      setFile(null);
      setFormError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refetch();
      toast({
        title: "Da nop giay to",
        description: "Ho so moi da duoc luu va chuyen ve hang doi phe duyet.",
        variant: "success",
      });
    } catch (err) {
      setFormError(err?.data?.message ?? "Khong the tai giay to len. Vui long thu lai.");
    }
  };

  const handleDownload = async (document) => {
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
          Khong the tai trang thai ho so.{" "}
          <button type="button" className="font-semibold underline" onClick={() => refetch()}>
            Thu lai
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
          {isRejected ? "Ho so can duoc cap nhat" : "Ho so dang cho phe duyet"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {isRejected
            ? "Ban co the nop lai giay to ben duoi. Ho so se tu dong quay ve hang doi phe duyet."
            : "ezTravel kiem tra trang thai tu dong moi 30 giay. Ban van co the bo sung hoac thay the giay to."}
        </p>
      </section>

      <section className="mx-auto mt-9 max-w-2xl rounded-md border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Doanh nghiep</p>
              <h2 className="mt-1 font-bold text-foreground">
                {provider.businessName ?? provider.tenDoanhNghiep ?? "Nha cung cap"}
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
              <ShieldCheck className="h-4 w-4" /> Ma ho so
            </dt>
            <dd className="mt-1 font-semibold text-foreground">#{provider.providerId ?? provider.maNhaCungCap}</dd>
          </div>
          <div>
            <dt className="inline-flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> Ngay gui
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
            Kiem tra lai
          </button>
          <Link
            to={AUTH_ROUTES.PROFILE}
            className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Xem ho so ca nhan
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-2xl rounded-md border bg-background p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FileCheck2 className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold text-foreground">Giay to xac minh</h2>
            <p className="mt-1 text-sm text-muted-foreground">PDF, JPG hoac PNG; toi da 5 MB moi tep.</p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Can nop it nhat mot giay to truoc khi Admin co the phe duyet.
          </div>
        ) : (
          <div className="mt-5 divide-y rounded-md border">
            {documents.map((document) => {
              const id = document.id ?? document.documentId;
              return (
                <div key={id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
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
                    Tai xuong
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <form className="mt-6 grid gap-4 border-t pt-5" onSubmit={handleUpload}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="provider-document-type" className="text-sm font-semibold text-foreground">Loai giay to</label>
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
              <label htmlFor="provider-document-file" className="text-sm font-semibold text-foreground">Tep ho so</label>
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
