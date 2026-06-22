import { useState  } from "react";
import {
  useGetCurrentProviderPackageQuery,
  useGetProviderPackagesQuery,
  useSimulateSubscriptionMutation } from
"../../store/apis/providerApi";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
"@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Check, ShieldAlert, ArrowUpCircle } from "lucide-react";


export default function ProviderPackages() {
  const { toast } = useToast();
  const { data: providerPackages, isLoading: isPkgListLoading } = useGetProviderPackagesQuery();
  const { data: currentPackage, isLoading: isCurrentPkgLoading } = useGetCurrentProviderPackageQuery();
  const [registerPackage, { isLoading: isRegistering }] = useSimulateSubscriptionMutation();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState("MONTH");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isLoading = isPkgListLoading || isCurrentPkgLoading;
  const packages = Array.isArray(providerPackages) ? providerPackages : providerPackages?.items || providerPackages?.data || [];

  const handleOpenRegisterDialog = (pkg) => {
    setSelectedPackage(pkg);
    setBillingPeriod("MONTH");
    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    try {
      await registerPackage({
        maGoiNcc: selectedPackage.maGoiNcc,
        durationType: billingPeriod,
        phuongThucThanhToan: "DEMO_PAYMENT"
      }).unwrap();

      toast({
        title: "Đăng ký thành công",
        description: `Bạn đã đăng ký gói ${selectedPackage.tenGoi} (${
        billingPeriod === "MONTH" ? "Tháng" : "Năm"}) thành công!`

      });
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng ký",
        description: err?.data?.message || "Đã xảy ra lỗi trong quá trình xử lý."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) =>
          <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          )}
        </div>
      </div>);

  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Intro */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50">
          Gói Dịch Vụ Đối Tác Commercial
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
          Tối ưu hóa khả năng tiếp cận khách hàng. Lựa chọn gói dịch vụ phù hợp để gia tăng vị thế hiển thị doanh nghiệp trên hệ thống ezTravel.
        </p>
      </div>

      {/* Package Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {packages?.map((pkg) => {
          const isCurrent = currentPackage?.maGoiNcc === pkg.maGoiNcc;

          return (
            <div
              key={pkg.maGoiNcc}
              className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 relative h-full ${
              isCurrent ?
              "border-teal-500 dark:border-teal-400 ring-1 ring-teal-500 shadow-md transform -translate-y-1" :
              "border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"}`
              }>
              
              {isCurrent &&
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                  Gói hiện tại của bạn
                </div>
              }

              {/* Package Header */}
              <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {pkg.tenGoi}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 h-8">
                  {pkg.moTa || "Gói dịch vụ dành cho nhà cung cấp ezTravel."}
                </p>
              </div>

              {/* Package Pricing */}
              <div className="p-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                    {pkg.giaThang === 0 ? "Miễn phí" : `${pkg.giaThang.toLocaleString()}đ`}
                    {pkg.giaThang > 0 && <span className="text-xs font-normal text-slate-400">/tháng</span>}
                  </div>
                  {pkg.giaNam > 0 &&
                  <div className="text-xs text-slate-500">
                      Hoặc {pkg.giaNam.toLocaleString()}đ<span className="text-[10px] font-normal">/năm</span>
                    </div>
                  }
                </div>
              </div>

              {/* Package Features List */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 ${pkg.uuTienTimKiem ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>Search Visibility (Ưu tiên tìm kiếm): {pkg.uuTienTimKiem ? "Có" : "Không"}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 ${pkg.uuTienTrangChu ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>Homepage Visibility (Hiển thị trang chủ): {pkg.uuTienTrangChu ? "Có" : "Không"}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 ${pkg.heSoUuTien > 1 ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>Explore Visibility (Hệ số ưu tiên: {pkg.heSoUuTien})</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 ${pkg.coBadgeDoiTac ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>Huy hiệu đối tác chính thức: {pkg.coBadgeDoiTac ? "Có" : "Không"}</span>
                  </li>
                </ul>

                {/* Buy Button */}
                <Button
                  className="w-full font-semibold"
                  variant={isCurrent ? "secondary" : "default"}
                  disabled={isCurrent}
                  onClick={() => handleOpenRegisterDialog(pkg)}>
                  
                  {isCurrent ? "Đang sử dụng" : pkg.giaThang === 0 ? "Kích hoạt" : "Đăng ký gói"}
                </Button>
              </div>
            </div>);

        })}
      </div>

      {/* Demo Payment Flow Purchase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-teal-600" />
              Đăng ký gói {selectedPackage?.tenGoi}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Vui lòng chọn chu kỳ thanh toán và xác nhận đăng ký gói dịch vụ.
            </DialogDescription>
          </DialogHeader>

          {/* Billing Period Selector */}
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Chu kỳ thanh toán
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingPeriod("MONTH")}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                  billingPeriod === "MONTH" ?
                  "border-teal-500 bg-teal-500/5 text-teal-600" :
                  "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                  }>
                  
                  <span className="text-xs font-bold">Theo tháng</span>
                  <span className="text-xs text-slate-500 mt-1">
                    {selectedPackage ? `${selectedPackage.giaThang.toLocaleString()}đ` : ""}
                  </span>
                </button>
                {selectedPackage && selectedPackage.giaNam > 0 &&
                <button
                  type="button"
                  onClick={() => setBillingPeriod("YEAR")}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                  billingPeriod === "YEAR" ?
                  "border-teal-500 bg-teal-500/5 text-teal-600" :
                  "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                  }>
                  
                    <span className="text-xs font-bold">Theo năm</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {selectedPackage.giaNam.toLocaleString()}đ
                    </span>
                  </button>
                }
              </div>
            </div>

            {/* Price Detail Summary */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gói đăng ký:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedPackage?.tenGoi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chu kỳ:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {billingPeriod === "MONTH" ? "1 tháng" : "12 tháng"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold text-slate-950 dark:text-slate-50">
                <span>Tổng tiền:</span>
                <span className="text-teal-600 dark:text-teal-400">
                  {selectedPackage ?
                  billingPeriod === "MONTH" ?
                  `${selectedPackage.giaThang.toLocaleString()}đ` :
                  `${selectedPackage.giaNam.toLocaleString()}đ` :
                  ""}
                </span>
              </div>
            </div>

            {/* Warning Alert (Demo Payment Notice) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <span className="font-bold">Hệ thống thử nghiệm (Demo Flow):</span> Đây là luồng thanh toán thử nghiệm. Quá trình thanh toán thực tế sẽ không diễn ra và hệ thống sẽ tự động đăng ký gói cước trực tiếp cho tài khoản của bạn.
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={isRegistering}>
              Hủy
            </Button>
            <Button size="sm" onClick={handleConfirmPurchase} disabled={isRegistering}>
              {isRegistering ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}

