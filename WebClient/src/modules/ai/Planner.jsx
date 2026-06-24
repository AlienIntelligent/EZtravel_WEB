import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
 Bot,
 CalendarDays,
 CheckCircle2,
 Loader2,
 MapPin,
 RotateCcw,
 Sparkles,
 Utensils,
 Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "../../store/hooks";
import { setActiveTrip } from "../../store/tripSlice";
import { useGenerateItineraryMutation } from "../../api/aiApi";
import {
 useCreateTripMutation,
 useUpdateTripTimelineMutation,
} from "../../store/apis/plannerApi";

const inputClass =
 "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const preferenceOptions = [
 "Văn hóa",
 "Thiên nhiên",
 "Ẩm thực",
 "Nghỉ dưỡng",
 "Mạo hiểm",
 "Mua sắm",
];

function AIPlanner() {
 const navigate = useNavigate();
 const dispatch = useAppDispatch();
 const [generatePlan, { isLoading }] = useGenerateItineraryMutation();
 const [createTrip, { isLoading: isCreatingTrip }] = useCreateTripMutation();
 const [updateTripTimeline, { isLoading: isSavingTimeline }] = useUpdateTripTimelineMutation();
 const [formData, setFormData] = useState({
 destination: "",
 startDate: "",
 endDate: "",
 budgetMode: "STANDARD",
 preferences: [],
 additionalNotes: "",
 });
 const [preview, setPreview] = useState(null);
 const [errorMessage, setErrorMessage] = useState("");

 const handlePreferenceToggle = (pref) => {
 setFormData((prev) => ({
 ...prev,
 preferences: prev.preferences.includes(pref) ?
 prev.preferences.filter((p) => p !== pref) :
 [...prev.preferences, pref]
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setErrorMessage("");
 try {
 const result = await generatePlan(formData).unwrap();
 setPreview(result);
 } catch (error) {
 setErrorMessage(
 error?.data?.message ?? "Không thể tạo lịch trình lúc này. Vui lòng thử lại.",
 );
 }
 };

 const handleAccept = async () => {
 if (!preview) return;
 try {
 const createdTrip = await createTrip({
 title: preview.trip?.title || preview.trip?.tenLichTrinh || `Lịch trình ${formData.destination}`,
 startDate: preview.trip?.startDate || formData.startDate,
 endDate: preview.trip?.endDate || formData.endDate,
 budget: preview.trip?.estimatedBudget || preview.trip?.tongChiPhiUocTinh,
 visibility: preview.trip?.visibility || "PRIVATE",
 }).unwrap();

 const tripId = createdTrip.id ?? createdTrip.maLichTrinh ?? createdTrip.tripId;
 if (!tripId) {
 throw new Error("Missing created trip id");
 }

 const days = (preview.days || []).map((day, dayIndex) => ({
 ngay: day.date,
 soThuTu: day.dayNumber || dayIndex + 1,
 ghiChu: day.summary,
 items: (day.items || []).map((item, itemIndex) => ({
 maDiaDiem: item.place?.maDiaDiem ?? item.place?.id,
 tieuDe: item.place?.tenDiaDiem ?? item.place?.name ?? item.note,
 startTime: item.time || (itemIndex === 0 ? "09:00" : "14:00"),
 thuTu: item.order || itemIndex + 1,
 ghiChu: item.note,
 })),
 }));

 await updateTripTimeline({
 id: tripId,
 body: { tripId, days },
 }).unwrap();

 const newTrip = {
 ...createdTrip,
 ...preview.trip,
 id: tripId,
 days: preview.days,
 placesDictionary: Object.fromEntries((preview.places || []).map((p) => [p.id, p])),
 servicesDictionary: Object.fromEntries((preview.services || []).map((s) => [s.id, s])),
 };

 dispatch(setActiveTrip(newTrip));
 navigate(`/trips/${tripId}/planner`);
 } catch (error) {
 console.error(error);
 setErrorMessage(
 error?.data?.message ?? "Không thể lưu lịch trình AI. Vui lòng thử lại.",
 );
 }
 };

 if (preview) {
 return (
 <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
 <section className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
 <header className="bg-slate-950 px-5 py-6 text-white sm:px-8">
 <div className="flex items-center gap-3">
 <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
 <Sparkles className="h-5 w-5" aria-hidden="true" />
 </span>
 <div>
 <h1 className="text-xl font-bold sm:text-2xl">Lịch trình AI đã sẵn sàng</h1>
 <p className="mt-1 text-sm text-slate-300">Kiểm tra kết quả trước khi lưu vào chuyến đi.</p>
 </div>
 </div>
 </header>

 <div className="space-y-6 p-5 sm:p-8">
 <div>
 <h2 className="text-xl font-bold text-foreground">
 {preview.trip?.title || `Lịch trình ${formData.destination}`}
 </h2>
 {preview.summary ? (
 <div className="mt-3 flex gap-3 rounded-md border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-slate-800 p-4 text-sm leading-6 text-sky-950 dark:text-sky-100">
 <Bot className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-400" aria-hidden="true" />
 <p>{preview.summary}</p>
 </div>
 ) : null}
 </div>

 <div className="grid gap-3 sm:grid-cols-3">
 {[
 [CalendarDays, preview.days?.length ?? 0, "Ngày"],
 [MapPin, preview.places?.length ?? 0, "Địa điểm"],
 [Utensils, preview.services?.length ?? 0, "Dịch vụ"],
 ].map(([Icon, value, label]) => (
 <div key={label} className="flex items-center gap-3 rounded-md border border-border p-4">
 <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
 <div>
 <div className="text-lg font-bold text-foreground">{value}</div>
 <div className="text-xs text-muted-foreground">{label}</div>
 </div>
 </div>
 ))}
 </div>

 {errorMessage ? (
 <div className="border-l-4 border-rose-600 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
 {errorMessage}
 </div>
 ) : null}

 <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
 <Button type="button" variant="outline" onClick={() => setPreview(null)}>
 <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
 Chỉnh lại
 </Button>
 <Button type="button" onClick={handleAccept} disabled={isCreatingTrip || isSavingTimeline}>
 {isCreatingTrip || isSavingTimeline ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
 ) : (
 <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
 )}
 Lưu và mở workspace
 </Button>
 </div>
 </div>
 </section>
 </main>
 );

 }

 return (
 <main className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
 <header className="mb-6">
 <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
 <Sparkles className="h-5 w-5" aria-hidden="true" />
 </div>
 <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">Tạo lịch trình bằng AI</h1>
 <p className="mt-2 text-sm leading-6 text-muted-foreground">
 Nhập nhu cầu thực tế để tạo một lịch trình có thể lưu trực tiếp vào chuyến đi.
 </p>
 </header>

 <form onSubmit={handleSubmit} className="space-y-5 rounded-md border border-border bg-background p-5 shadow-sm sm:p-7">
 {errorMessage ? (
 <div className="border-l-4 border-rose-600 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
 {errorMessage}
 </div>
 ) : null}

 <div className="space-y-1.5">
 <label htmlFor="ai-destination" className="text-sm font-semibold text-foreground">Điểm đến</label>
 <input
 id="ai-destination"
 type="text"
 className={inputClass}
 placeholder="Ví dụ: Đà Nẵng, Phú Quốc"
 required
 value={formData.destination}
 onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
 />
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-1.5">
 <label htmlFor="ai-start-date" className="text-sm font-semibold text-foreground">Ngày đi</label>
 <input id="ai-start-date" type="date" className={inputClass} required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
 </div>
 <div className="space-y-1.5">
 <label htmlFor="ai-end-date" className="text-sm font-semibold text-foreground">Ngày về</label>
 <input id="ai-end-date" type="date" className={inputClass} required min={formData.startDate || undefined} value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
 </div>
 </div>

 <div className="space-y-1.5">
 <label htmlFor="ai-budget" className="text-sm font-semibold text-foreground">Ngân sách</label>
 <select id="ai-budget" className={inputClass} value={formData.budgetMode} onChange={(e) => setFormData({ ...formData, budgetMode: e.target.value })}>
 <option value="ECONOMY">Tiết kiệm</option>
 <option value="STANDARD">Tiêu chuẩn</option>
 <option value="LUXURY">Cao cấp</option>
 </select>
 </div>

 <fieldset className="space-y-2">
 <legend className="text-sm font-semibold text-foreground">Sở thích</legend>
 <div className="flex flex-wrap gap-2">
 {preferenceOptions.map((preference) => {
 const selected = formData.preferences.includes(preference);
 return (
 <button
 type="button"
 key={preference}
 className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
 selected
 ? "border-primary bg-primary text-white"
 : "border-input bg-background text-muted-foreground hover:border-slate-400"
 }`}
 aria-pressed={selected}
 onClick={() => handlePreferenceToggle(preference)}
 >
 {preference}
 </button>
 );
 })}
 </div>
 </fieldset>

 <div className="space-y-1.5">
 <label htmlFor="ai-notes" className="text-sm font-semibold text-foreground">Ghi chú thêm</label>
 <textarea
 id="ai-notes"
 className={`${inputClass} min-h-28 resize-y py-3`}
 placeholder="Ví dụ: đi cùng trẻ nhỏ, ưu tiên quãng đường ngắn"
 value={formData.additionalNotes}
 onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
 />
 </div>

 <Button type="submit" className="w-full" disabled={isLoading}>
 {isLoading ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
 ) : (
 <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
 )}
 {isLoading ? "Đang tạo lịch trình..." : "Tạo lịch trình"}
 </Button>
 </form>
 </main>
 );
}

export default AIPlanner;
