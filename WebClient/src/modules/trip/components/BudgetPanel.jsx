import { Banknote, BedDouble, Soup, Ticket, Sparkles, Loader2, Bot } from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { useAnalyzeBudgetMutation } from "../../../api/aiApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function BudgetPanel() {
  const navigate = useNavigate();
  const budgetSummary = useAppSelector((state) => state.trip.budgetSummary);
  const days = useAppSelector((state) => state.trip.timelineDays);
  const placesDict = useAppSelector((state) => state.trip.placesDictionary);
  const servicesDict = useAppSelector((state) => state.trip.servicesDictionary);
  const activeTrip = useAppSelector((state) => state.trip.activeTrip);
  const user = useAppSelector((state) => state.auth.user);

  const [analyzeBudget, { isLoading: isAnalyzing }] = useAnalyzeBudgetMutation();
  const [advice, setAdvice] = useState("");
  const [adviceStatus, setAdviceStatus] = useState("");

  const nodes = days.flatMap((day) => day.nodes || []);

  const handleAnalyze = async () => {
    const isPremium = activeTrip && ['PREMIUM_TRAVELER', 'PROVIDER_APPROVED', 'ADMIN'].includes(user?.role);
    if (!isPremium) {
      Swal.fire({
        title: "Tính năng Premium",
        text: "Bạn cần nâng cấp lên tài khoản Premium để sử dụng trợ lý tư vấn ngân sách bằng AI.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Nâng cấp ngay",
        cancelButtonText: "Để sau",
        confirmButtonColor: "#3b82f6",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/upgrade");
        }
      });
      return;
    }

    try {
      const numericTripId = Number(activeTrip.id);
      const result = await analyzeBudget({ tripId: numericTripId }).unwrap();
      if (result.success) {
        setAdvice(result.analysisText);
        setAdviceStatus(result.status);
      } else {
        Swal.fire("Lỗi", result.analysisText || "Không thể phân tích ngân sách.", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể phân tích ngân sách.", "error");
    }
  };

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <header className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="font-bold text-slate-950">Chi phí chuyến đi</h2>
        </div>
      </header>

      <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200">
        {[
          [BedDouble, "Lưu trú", budgetSummary.accommodation],
          [Soup, "Ăn uống", budgetSummary.food],
          [Ticket, "Hoạt động", budgetSummary.activity],
        ].map(([Icon, label, value]) => (
          <div key={label} className="min-w-0 p-3 text-center">
            <Icon className="mx-auto h-4 w-4 text-slate-500" aria-hidden="true" />
            <div className="mt-1 truncate text-[11px] text-slate-500">{label}</div>
            <div className="mt-1 truncate text-xs font-bold text-slate-800">
              {formatCurrency(value)}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {nodes.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm leading-6 text-slate-500">
            Chưa có khoản chi nào trong timeline.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {nodes.map((node) => {
              const isItem = node.type === "TIMELINE_ITEM";
              const item = isItem ? node.item : null;
              const title =
                item && "placeId" in item
                  ? placesDict[item.placeId]?.name || item.placeId
                  : item && "serviceId" in item
                    ? servicesDict[item.serviceId]?.name || item.serviceId
                    : "Khoản chi khác";
              const cost =
                item && "estimatedCost" in item ? item.estimatedCost || 0 : 0;

              return (
                <div key={node.id} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-slate-700">{title}</span>
                  <span className="shrink-0 font-semibold text-slate-900">{formatCurrency(cost)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Budget Advisor Section */}
      <div className="border-t border-slate-150 bg-slate-50/50 p-3.5">
        {advice ? (
          <div className={`mb-3.5 flex gap-2.5 rounded-lg border p-3.5 text-xs leading-5 shadow-sm ${
            adviceStatus === "OVER_BUDGET"
              ? "border-rose-200 bg-rose-50 text-rose-950"
              : adviceStatus === "ON_TRACK"
                ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                : "border-sky-200 bg-sky-50 text-sky-950"
          }`}>
            <Bot className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
              adviceStatus === "OVER_BUDGET" ? "text-rose-600" : adviceStatus === "ON_TRACK" ? "text-emerald-600" : "text-sky-600"
            }`} aria-hidden="true" />
            <div>
              <strong className="block mb-0.5 font-bold">Trợ lý tài chính AI:</strong>
              <p>{advice}</p>
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 text-xs h-9 font-semibold"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          Tư vấn ngân sách bằng AI
        </Button>
      </div>

      <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm font-semibold text-slate-700">Tổng dự kiến</span>
        <strong className="text-base text-primary">{formatCurrency(budgetSummary.total)}</strong>
      </footer>
    </section>
  );
}

export default BudgetPanel;
