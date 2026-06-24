import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 ArrowLeft,
 CalendarDays,
 Globe2,
 ImageIcon,
 Loader2,
 LockKeyhole,
 Map,
 PlaneTakeoff,
 Wallet,
 MapPin,
 ArrowRightLeft
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCreateTripMutation } from "../../store/apis/plannerApi";
import { useGetRegionsQuery } from "../../store/apis/exploreApi";

const toLocalDateInput = (date) => {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, "0");
 const day = String(date.getDate()).padStart(2, "0");
 return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
 const next = new Date(date);
 next.setDate(next.getDate() + days);
 return next;
};

const today = new Date();

const initialForm = {
 title: "",
 description: "",
 startDate: toLocalDateInput(today),
 endDate: toLocalDateInput(addDays(today, 2)),
 budget: "",
 visibility: "PRIVATE",
 thumbnail: "",
 tripType: "ONE_WAY",
 maTinhXuatPhat: "",
 maTinhKetThuc: "",
 maTinhQuayDau: "",
};

const getTripId = (trip) => trip?.id ?? trip?.maLichTrinh ?? trip?.tripId;

export default function TripCreate() {
 const navigate = useNavigate();
 const { toast } = useToast();
 const [createTrip, { isLoading }] = useCreateTripMutation();
 const { data: regionsData, isLoading: isLoadingRegions } = useGetRegionsQuery();
 const [form, setForm] = useState(initialForm);
 const [error, setError] = useState("");

 const updateField = (field) => (event) => {
 setForm((current) => ({ ...current, [field]: event.target.value }));
 if (error) setError("");
 };

 const handleSubmit = async (event) => {
 event.preventDefault();
 const title = form.title.trim();
 if (!title) {
 setError("Tên chuyến đi là bắt buộc.");
 return;
 }
 if (!form.startDate || !form.endDate) {
 setError("Ngày bắt đầu và kết thúc là bắt buộc.");
 return;
 }
 if (form.endDate < form.startDate) {
 setError("Ngày kết thúc không được trước ngày bắt đầu.");
 return;
 }

 const budget = Number(form.budget);
 if (form.budget && (!Number.isFinite(budget) || budget < 0)) {
 setError("Ngân sách không hợp lệ.");
 return;
 }

 try {
 const created = await createTrip({
 title,
 description: form.description.trim() || undefined,
 startDate: form.startDate,
 endDate: form.endDate,
 budget: form.budget ? budget : undefined,
 visibility: form.visibility,
 thumbnail: form.thumbnail.trim() || undefined,
 }).unwrap();

 const tripId = getTripId(created);
 toast({
 title: "Đã tạo chuyến đi",
 description: "Các ngày trong lịch trình đã được tạo và sẵn sàng để lên kế hoạch.",
 variant: "success",
 });
 
 navigate(tripId ? `/trips/${tripId}/planner` : "/trips", {
   state: {
     tripType: form.tripType,
     maTinhXuatPhat: form.maTinhXuatPhat ? parseInt(form.maTinhXuatPhat) : undefined,
     maTinhKetThuc: form.maTinhKetThuc ? parseInt(form.maTinhKetThuc) : undefined,
     maTinhQuayDau: form.tripType === "ROUND_TRIP" && form.maTinhQuayDau ? parseInt(form.maTinhQuayDau) : undefined,
   }
 });
 } catch (err) {
 const message = err?.data?.error ?? err?.data?.message ?? "Không thể tạo chuyến đi. Vui lòng thử lại.";
 setError(message);
 toast({ title: "Không thể tạo chuyến đi", description: message, variant: "error" });
 }
 };

 const previewImage = form.thumbnail.trim();
 const canSubmit = form.title.trim() && form.startDate && form.endDate && !isLoading;

 return (
 <div className="container mx-auto max-w-5xl px-4 py-8 pb-14">
 <Link
 to="/trips"
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 Quay lại chuyến đi
 </Link>

 <div className="mb-7">
 <h1 className="text-3xl font-bold text-foreground">Tạo chuyến đi mới</h1>
 <p className="mt-2 text-sm text-muted-foreground">Khởi tạo lịch trình, sau đó thêm địa điểm và dịch vụ trong planner.</p>
 </div>

 <form className="grid gap-7 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
 <main className="space-y-7">
 {error && (
 <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <section>
 <h2 className="text-lg font-bold text-foreground">Thông tin chuyến đi</h2>
 <div className="mt-5 space-y-5">
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="trip-title">Tên chuyến đi</label>
 <input
 id="trip-title"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 placeholder="VD: Đà Nẵng - Hội An 3 ngày"
 value={form.title}
 onChange={updateField("title")}
 disabled={isLoading}
 maxLength={300}
 required
 />
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="trip-description">Mô tả</label>
 <textarea
 id="trip-description"
 className="mt-2 min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary"
 placeholder="Mục tiêu chuyến đi, thành viên, ghi chú quan trọng..."
 value={form.description}
 onChange={updateField("description")}
 disabled={isLoading}
 maxLength={2000}
 />
 </div>
 </div>
 </section>

 <section className="border-t pt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Địa điểm hành trình</h2>
            <div className="flex items-center gap-2 rounded-md bg-muted p-1">
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-semibold rounded transition ${form.tripType === "ONE_WAY" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                onClick={() => setForm(c => ({ ...c, tripType: "ONE_WAY", maTinhQuayDau: "" }))}
              >
                1 chiều
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-semibold rounded transition ${form.tripType === "ROUND_TRIP" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                onClick={() => setForm(c => ({ ...c, tripType: "ROUND_TRIP" }))}
              >
                Khứ hồi
              </button>
            </div>
          </div>
          
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="trip-start-point">Tỉnh xuất phát</label>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="trip-start-point"
                  className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary appearance-none"
                  value={form.maTinhXuatPhat}
                  onChange={updateField("maTinhXuatPhat")}
                  disabled={isLoadingRegions}
                >
                  <option value="">Chọn tỉnh thành...</option>
                  {regionsData?.map((region) => (
                    <option key={region.id} value={region.id}>{region.tenTinhThanh}</option>
                  ))}
                </select>
              </div>
            </div>

            {form.tripType === "ROUND_TRIP" && (
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="trip-turn-point">Tỉnh quay đầu</label>
                <div className="relative mt-2">
                  <ArrowRightLeft className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <select
                    id="trip-turn-point"
                    className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary appearance-none"
                    value={form.maTinhQuayDau}
                    onChange={updateField("maTinhQuayDau")}
                    disabled={isLoadingRegions}
                  >
                    <option value="">Chọn tỉnh thành...</option>
                    {regionsData?.map((region) => (
                      <option key={region.id} value={region.id}>{region.tenTinhThanh}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="trip-end-point">Tỉnh kết thúc</label>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="trip-end-point"
                  className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary appearance-none"
                  value={form.maTinhKetThuc}
                  onChange={updateField("maTinhKetThuc")}
                  disabled={isLoadingRegions}
                >
                  <option value="">Chọn tỉnh thành...</option>
                  {regionsData?.map((region) => (
                    <option key={region.id} value={region.id}>{region.tenTinhThanh}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

 <section className="border-t pt-7">
 <h2 className="text-lg font-bold text-foreground">Thời gian và ngân sách</h2>
 <div className="mt-5 grid gap-5 sm:grid-cols-2">
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="trip-start">Ngày bắt đầu</label>
 <div className="relative mt-2">
 <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="trip-start"
 className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
 value={form.startDate}
 onChange={(event) => {
 const startDate = event.target.value;
 setForm((current) => ({
 ...current,
 startDate,
 endDate: current.endDate < startDate ? startDate : current.endDate,
 }));
 if (error) setError("");
 }}
 disabled={isLoading}
 type="date"
 required
 />
 </div>
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="trip-end">Ngày kết thúc</label>
 <div className="relative mt-2">
 <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="trip-end"
 className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
 value={form.endDate}
 onChange={updateField("endDate")}
 disabled={isLoading}
 min={form.startDate}
 type="date"
 required
 />
 </div>
 </div>
 <div className="sm:col-span-2">
 <label className="text-sm font-semibold text-foreground" htmlFor="trip-budget">Ngân sách tối đa</label>
 <div className="relative mt-2">
 <Wallet className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="trip-budget"
 className="h-11 w-full rounded-md border bg-background pl-10 pr-14 text-sm outline-none transition focus:border-primary"
 placeholder="0"
 value={form.budget}
 onChange={updateField("budget")}
 disabled={isLoading}
 min="0"
 step="100000"
 type="number"
 />
 <span className="absolute right-3 top-3 text-sm text-muted-foreground">VND</span>
 </div>
 </div>
 </div>
 </section>

 <section className="border-t pt-7">
 <h2 className="text-lg font-bold text-foreground">Quyền riêng tư</h2>
 <div className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
 <button
 type="button"
 className={`inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition ${
 form.visibility === "PRIVATE" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
 }`}
 onClick={() => setForm((current) => ({ ...current, visibility: "PRIVATE" }))}
 >
 <LockKeyhole className="h-4 w-4" />
 Riêng tư
 </button>
 <button
 type="button"
 className={`inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition ${
 form.visibility === "PUBLIC" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
 }`}
 onClick={() => setForm((current) => ({ ...current, visibility: "PUBLIC" }))}
 >
 <Globe2 className="h-4 w-4" />
 Công khai
 </button>
 </div>
 </section>
 </main>

 <aside className="space-y-5">
 <div className="rounded-md border bg-background p-4 shadow-sm">
 <h2 className="text-sm font-bold text-foreground">Ảnh chuyến đi</h2>
 <div className="mt-3 overflow-hidden rounded-md border bg-muted/40">
 {previewImage ? (
 <img src={previewImage} alt="Trip preview" className="h-44 w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
 <ImageIcon className="h-7 w-7" />
 Chưa có ảnh
 </div>
 )}
 </div>
 <input
 className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 placeholder="https://..."
 value={form.thumbnail}
 onChange={updateField("thumbnail")}
 disabled={isLoading}
 type="url"
 />
 </div>

 <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
 <Map className="mb-3 h-6 w-6 text-primary" />
 <p className="leading-6">Sau khi tạo, ezTravel mở planner với các ngày được khởi tạo theo khoảng thời gian bạn chọn.</p>
 </div>

 <div className="flex gap-3">
 <Link
 to="/trips"
 className="inline-flex h-11 flex-1 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
 >
 Hủy
 </Link>
 <button
 type="submit"
 className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-cta px-4 text-sm font-semibold text-white shadow-md shadow-cta/20 transition-all hover:-translate-y-0.5 hover:bg-cta/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
 disabled={!canSubmit}
 >
 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlaneTakeoff className="h-4 w-4" />}
 Tạo chuyến đi
 </button>
 </div>
 </aside>
 </form>
 </div>
 );
}
