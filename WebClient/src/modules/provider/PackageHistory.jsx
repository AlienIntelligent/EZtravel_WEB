import { useGetPackageHistoryQuery } from "../../store/apis/providerApi";

import EmptyState from "../../features/explore/components/EmptyState";
import { History, CheckCircle2, XCircle, Info } from "lucide-react";

export default function ProviderPackageHistory() {
  const { data: history, isLoading } = useGetPackageHistoryQuery();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto py-4">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>);

  }

  if (!history || history.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50 mb-6">
          Lịch sử đăng ký gói cước
        </h3>
        <EmptyState
          title="Chưa có lịch sử đăng ký"
          description="Hiện tại doanh nghiệp của bạn chưa thực hiện bất kỳ giao dịch đăng ký gói cước nào."
          icon={History} />
        
      </div>);

  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Title */}
      <div>
        <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50">
          Lịch sử đăng ký gói cước
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi danh sách các gói cước đã đăng ký và thời gian hiệu lực tương ứng.
        </p>
      </div>

      {/* Desktop Responsive Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-4 px-6">Gói cước</th>
                <th className="py-4 px-4">Ngày đăng ký</th>
                <th className="py-4 px-4">Hiệu lực</th>
                <th className="py-4 px-4">Đã thanh toán</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {history.map((item) =>
              <tr key={item.maDangKyGoiNcc} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-50">
                    {item.tenGoi}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(item.ngayTao).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")} -{" "}
                    {item.ngayKetThuc ? new Date(item.ngayKetThuc).toLocaleDateString("vi-VN") : "Vô hạn"}
                  </td>
                  <td className="py-4 px-4 font-semibold text-teal-600 dark:text-teal-400">
                    {item.giaDaThanhToan?.toLocaleString() || 0}đ
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.trangThai === "ACTIVE" ?
                    "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" :
                    item.trangThai === "PENDING" ?
                    "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400" :
                    "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400"}`
                    }>
                    
                      {item.trangThai === "ACTIVE" ?
                    <CheckCircle2 className="w-3 h-3" /> :
                    item.trangThai === "PENDING" ?
                    <Info className="w-3 h-3" /> :

                    <XCircle className="w-3 h-3" />
                    }
                      {item.trangThai}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="space-y-4 md:hidden">
        {history.map((item) =>
        <div
          key={item.maDangKyGoiNcc}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-50">
                  {item.tenGoi}
                </h4>
                <span className="text-[10px] text-slate-400">
                  Đăng ký: {new Date(item.ngayTao).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              item.trangThai === "ACTIVE" ?
              "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" :
              item.trangThai === "PENDING" ?
              "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400" :
              "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400"}`
              }>
              
                {item.trangThai}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Hiệu lực</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")} -{" "}
                  {item.ngayKetThuc ? new Date(item.ngayKetThuc).toLocaleDateString("vi-VN") : "Vô hạn"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Đã thanh toán</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {item.giaDaThanhToan?.toLocaleString() || 0}đ
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}