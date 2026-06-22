import { useState } from "react";
import {
  CalendarDays,
  Check,
  Crown,
  History,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetCurrentTravelerPackageQuery,
  useGetTravelerPackageHistoryQuery,
  useGetTravelerPackagesQuery,
  useSubscribeTravelerPackageMutation,
} from "../../store/apis/travelerPackageApi";

const getPackageId = (pkg) => pkg?.id ?? pkg?.packageId ?? pkg?.maGoi;
const getPackageName = (pkg) => pkg?.name ?? pkg?.tenGoi ?? "Premium";
const getPackagePrice = (pkg) => Number(pkg?.price ?? pkg?.giaGoi ?? 0);
const getDuration = (pkg) => pkg?.durationDays ?? pkg?.soNgay ?? 0;

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const formatDate = (value) => {
  if (!value) return "Chua cap nhat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chua cap nhat";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

export default function Upgrade() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const {
    data: packages = [],
    isLoading: isLoadingPackages,
    isError: isPackagesError,
    refetch: refetchPackages,
  } = useGetTravelerPackagesQuery();
  const {
    data: currentPackage,
    isLoading: isLoadingCurrent,
    isError: isCurrentError,
    refetch: refetchCurrent,
  } = useGetCurrentTravelerPackageQuery();
  const {
    data: history = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useGetTravelerPackageHistoryQuery();
  const [subscribe, { isLoading: isSubscribing }] =
    useSubscribeTravelerPackageMutation();

  const currentPackageId = currentPackage?.packageId ?? currentPackage?.maGoi;

  const refreshAll = () => {
    refetchPackages();
    refetchCurrent();
    refetchHistory();
  };

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    try {
      const result = await subscribe({
        packageId: getPackageId(selectedPackage),
      }).unwrap();
      if (result?.success === false) {
        throw new Error(result.message ?? "Không thể kích hoạt gói.");
      }

      toast({
        title: "Đã kích hoạt Premium",
        description: `Gói ${getPackageName(selectedPackage)} đã được lưu vào tài khoản.`,
        variant: "success",
      });
      setSelectedPackage(null);
    } catch (err) {
      toast({
        title: "Không thể kích hoạt gói",
        description: err?.data?.message ?? err?.message ?? "Vui lòng thử lại.",
        variant: "error",
      });
    }
  };

  if (isLoadingPackages || isLoadingCurrent) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="h-24 animate-pulse rounded-md bg-muted/40" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-80 animate-pulse rounded-md bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  if (isPackagesError || isCurrentError) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Không thể tải thông tin gói Premium.{" "}
          <button type="button" className="font-semibold underline" onClick={refreshAll}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-16">
      <div className="flex flex-col gap-5 border-b pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">ezTravel Premium</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Nâng cấp tài khoản</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Chọn gói theo thời hạn để mở AI Planner và AI Chat. Quyền Premium được tính từ đăng ký còn hiệu lực trong hệ thống.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
          onClick={refreshAll}
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {currentPackage && (
        <section className="mt-7 flex flex-col gap-5 rounded-md border border-emerald-200 bg-emerald-50 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-emerald-700">Gói đang hoạt động</p>
              <h2 className="mt-1 text-lg font-bold text-emerald-950">
                {currentPackage.packageName ?? currentPackage.tenGoi}
              </h2>
            </div>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-emerald-900">
            <div>
              <dt className="text-xs text-emerald-700">Bắt đầu</dt>
              <dd className="mt-1 font-semibold">{formatDate(currentPackage.startDate ?? currentPackage.ngayBatDau)}</dd>
            </div>
            <div>
              <dt className="text-xs text-emerald-700">Hết hạn</dt>
              <dd className="mt-1 font-semibold">{formatDate(currentPackage.endDate ?? currentPackage.ngayKetThuc)}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="mt-9">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-foreground">Các gói hiện có</h2>
          <p className="mt-1 text-sm text-muted-foreground">Giá và thời hạn được tải trực tiếp từ hệ thống.</p>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-md border bg-background px-5 py-12 text-center">
            <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 font-bold text-foreground">Chưa có gói đang hoạt động</h3>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => {
              const id = getPackageId(pkg);
              const isCurrent = id === currentPackageId || pkg.isCurrent;
              return (
                <article
                  key={id}
                  className={`flex min-h-[340px] flex-col rounded-md border bg-background p-5 shadow-sm ${
                    isCurrent ? "border-emerald-400 ring-1 ring-emerald-300" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{getPackageName(pkg)}</h3>
                      <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">
                        {pkg.description ?? pkg.moTa ?? "Gói Premium dành cho Traveler."}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                        Hiện tại
                      </span>
                    )}
                  </div>

                  <div className="mt-5 border-y py-4">
                    <p className="text-2xl font-bold text-foreground">{formatMoney(getPackagePrice(pkg))}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {getDuration(pkg)} ngày
                    </p>
                  </div>

                  <ul className="mt-5 flex-1 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      AI Planner và AI Chat trong thời hạn gói
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Quyền Premium cập nhật tự động theo subscription
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Lịch sử đăng ký được lưu trên tài khoản
                    </li>
                  </ul>

                  <button
                    type="button"
                    className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    onClick={() => setSelectedPackage(pkg)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? <ShieldCheck className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    {isCurrent ? "Đang sử dụng" : "Kích hoạt demo"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 border-t pt-8">
        <div className="mb-5 flex items-center gap-3">
          <History className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Lịch sử đăng ký</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tối đa 50 lần kích hoạt gần nhất.</p>
          </div>
        </div>

        {isLoadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <p className="rounded-md border bg-background p-5 text-sm text-muted-foreground">Chưa có lịch sử đăng ký.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border bg-background">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Gói</th>
                  <th className="px-4 py-3">Bắt đầu</th>
                  <th className="px-4 py-3">Kết thúc</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((item) => (
                  <tr key={item.id ?? item.subscriptionId ?? item.maDangKy}>
                    <td className="px-4 py-3 font-semibold text-foreground">{item.packageName ?? item.tenGoi}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.startDate ?? item.ngayBatDau)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.endDate ?? item.ngayKetThuc)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatMoney(item.price ?? item.giaGoi)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-1 text-xs font-bold text-foreground">
                        {item.status ?? item.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog open={Boolean(selectedPackage)} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kích hoạt {selectedPackage ? getPackageName(selectedPackage) : "Premium"}</DialogTitle>
            <DialogDescription>
              Đây là luồng mô phỏng thanh toán. Hệ thống không thu tiền, nhưng sẽ kích hoạt gói trên tài khoản.
            </DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-3 rounded-md border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Thời hạn</span>
                <span className="font-semibold text-foreground">{getDuration(selectedPackage)} ngày</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Giá niêm yết</span>
                <span className="font-semibold text-foreground">{formatMoney(getPackagePrice(selectedPackage))}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold hover:bg-muted"
              onClick={() => setSelectedPackage(null)}
              disabled={isSubscribing}
            >
              Hủy
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing && <Loader2 className="h-4 w-4 animate-spin" />}
              Xác nhận kích hoạt
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
