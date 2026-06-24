import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
 SortableContext,
 useSortable,
 verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
 Activity,
 AlertTriangle,
 BedDouble,
 CalendarPlus,
 Car,
 Clock,
 GripVertical,
 MapPin,
 Navigation,
 Pencil,
 Plus,
 Trash2,
 Utensils,
 Wallet,
 X,
 Sparkles,
 Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
 insertTimelineNode,
 removeTimelineNode,
 updateTimelineItem,
 setTimelineDays,
} from "../../../store/tripSlice";
import { useOptimizeRouteMutation } from "../../../api/aiApi";
import Swal from "sweetalert2";
import { CheckCircle2 } from "lucide-react";

const formatCurrency = (value) =>
 new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 maximumFractionDigits: 0,
 }).format(Number(value) || 0);

const formatDay = (value) => {
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "Ngày chưa xác định";
 return date.toLocaleDateString("vi-VN", {
 weekday: "long",
 day: "2-digit",
 month: "2-digit",
 year: "numeric",
 });
};

const formatTime = (value) => value ? String(value).slice(0, 5) : "--:--";

const getResourceConfig = (type) => {
 switch (type) {
 case "HOTEL":
 return { Icon: BedDouble, className: "bg-indigo-50 text-indigo-700" };
 case "RESTAURANT":
 return { Icon: Utensils, className: "bg-amber-50 text-amber-700" };
 case "ACTIVITY":
 return { Icon: Activity, className: "bg-emerald-50 text-emerald-700" };
 case "TRANSPORT":
 return { Icon: Car, className: "bg-cyan-50 text-cyan-700" };
 default:
 return { Icon: MapPin, className: "bg-rose-50 text-primary" };
 }
};

function SortableNode({ id, node, dayId, index, children }) {
 const { attributes, listeners, setNodeRef, transform, transition, isOver, isDragging } =
 useSortable({
 id,
 data: { type: node.type, item: node, dayId, index },
 });

 return (
 <div
 ref={setNodeRef}
 className={`transition-all rounded-md ${isDragging ? "opacity-30 bg-muted/50 border-2 border-dashed border-primary" : ""} ${isOver && !isDragging ? "border-t-[3px] border-t-primary pt-1 mt-1 rounded-t-sm" : "border-t-[3px] border-transparent pt-1 mt-1"}`}
 style={{
 transform: CSS.Transform.toString(transform),
 transition,
 }}
 >
 {children({ ...attributes, ...listeners })}
 </div>
 );
}

function TimelineItem({ node, dayDate, tripStatus, placesDict, servicesDict, dragHandleProps, onEdit, onDelete }) {
 const isPlace = "placeId" in node.item;
 const service = isPlace ? null : servicesDict[node.item.serviceId];
 const title = node.item.title || (isPlace
 ? placesDict[node.item.placeId]?.name || "Địa điểm"
 : service?.name || "Dịch vụ");
 const serviceType = service?.type;
 const resourceType = isPlace
 ? "PLACE"
 : serviceType === "ACCOMMODATION"
 ? "HOTEL"
 : serviceType === "FOOD"
 ? "RESTAURANT"
 : serviceType === "ACTIVITY"
 ? "ACTIVITY"
 : "TRANSPORT";
 const { Icon, className } = getResourceConfig(resourceType);
 const cost = node.item.estimatedCost ?? node.item.estimated_cost ?? 0;

 let isCompleted = false;
 if (tripStatus === "IN_PROGRESS" && node.item.endTime && dayDate) {
   try {
     const [hours, minutes] = node.item.endTime.split(":");
     const endDateTime = new Date(dayDate);
     endDateTime.setHours(Number(hours), Number(minutes), 0, 0);
     if (new Date() > endDateTime) {
       isCompleted = true;
     }
   } catch {
     // Ignore invalid dates
   }
 }

 return (
 <div className={`group grid grid-cols-[48px_28px_minmax(0,1fr)] gap-2 sm:grid-cols-[64px_32px_minmax(0,1fr)] sm:gap-3 ${isCompleted ? 'opacity-60' : ''}`}>
 <time className="pt-3 text-right text-xs font-semibold text-muted-foreground">
 {formatTime(node.item.startTime)}
 </time>
 <div className="relative flex justify-center">
 <span className="absolute inset-y-0 w-px bg-slate-200" />
 <span className={`relative mt-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${className}`}>
 <Icon className="h-4 w-4" aria-hidden="true" />
 </span>
 </div>
 <article className="mb-4 flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-sm transition-shadow hover:shadow-md">
 <button
 type="button"
 className="flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded text-slate-300 hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
 aria-label="Kéo để sắp xếp"
 {...dragHandleProps}
 >
 <GripVertical className="h-4 w-4" aria-hidden="true" />
 </button>
 <div className="min-w-0 flex-1">
 <h3 className={`line-clamp-2 text-sm font-semibold leading-5 text-foreground sm:truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
   {isCompleted && <CheckCircle2 className="inline-block mr-1 h-4 w-4 text-emerald-500" />}
   {title}
 </h3>
 <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
 {node.item.endTime ? (
 <span className="flex items-center gap-1">
 <Clock className="h-3 w-3" aria-hidden="true" />
 đến {formatTime(node.item.endTime)}
 </span>
 ) : null}
 {Number(cost) > 0 ? <span>{formatCurrency(cost)}</span> : null}
 </div>
 </div>
 <div className="flex shrink-0 items-center gap-1">
 <button
 type="button"
 className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
 aria-label={`Sửa ${title}`}
 onClick={onEdit}
 >
 <Pencil className="h-4 w-4" aria-hidden="true" />
 </button>
 <button
 type="button"
 className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600 sm:flex"
 aria-label={`Xóa ${title}`}
 onClick={onDelete}
 >
 <Trash2 className="h-4 w-4" aria-hidden="true" />
 </button>
 </div>
 </article>
 </div>
 );
}

function TravelSegment({ node }) {
 return (
 <div className="grid grid-cols-[48px_28px_minmax(0,1fr)] gap-2 sm:grid-cols-[64px_32px_minmax(0,1fr)] sm:gap-3">
 <div />
 <div className="relative flex justify-center">
 <span className="absolute inset-y-0 w-px border-l border-dashed border-input" />
 <span className="relative my-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
 <Navigation className="h-3 w-3" aria-hidden="true" />
 </span>
 </div>
 <div className="my-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
 <span className="font-semibold text-muted-foreground">
 {node.mode === "WALKING" ? "Đi bộ" : node.mode === "TAXI" ? "Taxi" : "Di chuyển"}
 </span>
 {node.duration ? <span>{node.duration}</span> : null}
 {node.distance ? <span>{node.distance}</span> : null}
 {node.cost ? <span>{formatCurrency(node.cost)}</span> : null}
 </div>
 </div>
 );
}

function LocationCanvas({ node, placesDict }) {
 const place = placesDict[node.anchorPlace?.placeId];
 const groupedItems = Object.values(node.groups || {}).flatMap(
 (group) => group.items || [],
 );

 return (
 <div className="grid grid-cols-[48px_28px_minmax(0,1fr)] gap-2 sm:grid-cols-[64px_32px_minmax(0,1fr)] sm:gap-3">
 <div />
 <div className="relative flex justify-center">
 <span className="absolute inset-y-0 w-px bg-slate-200" />
 <span className="relative mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
 <MapPin className="h-4 w-4" aria-hidden="true" />
 </span>
 </div>
 <article className="mb-4 overflow-hidden rounded-md border border-border bg-background shadow-sm">
 <div className="h-28 bg-muted sm:h-36">
 <img src="/images/destination-4.jpg"
 alt={place?.name || "Địa điểm"}
 className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 </div>
 <div className="flex items-start justify-between gap-4 p-4">
 <div className="min-w-0">
 <h3 className="truncate font-bold text-foreground">{place?.name || "Địa điểm"}</h3>
 <p className="mt-1 text-xs text-muted-foreground">{groupedItems.length} dịch vụ đã liên kết</p>
 </div>
 <span className="shrink-0 text-sm font-semibold text-primary">
 {formatCurrency(node.locationBudget)}
 </span>
 </div>
 </article>
 </div>
 );
}

function DaySection({ day, index, tripStatus, placesDict, servicesDict, isSelected, onEdit, onDelete }) {
 const nodes = day.nodes || [];
 const { setNodeRef, isOver } = useDroppable({
 id: day.id || `day-container-${index}`,
 data: { type: "DAY_CONTAINER", dayId: day.id },
 });

 return (
 <section className={isSelected ? "block" : "hidden md:block"}>
 <header className="mb-5 sm:pl-24">
 <h2 className="text-xl font-bold text-foreground">{formatDay(day.date)}</h2>
 <p className="mt-1 text-sm text-muted-foreground">Ngày {Number(day.sequence ?? index) + 1}</p>
 </header>

 <div ref={setNodeRef} className={`min-h-32 transition-colors ${isOver && nodes.length === 0 ? "bg-primary/5 rounded-md border-2 border-dashed border-primary" : ""}`}>
 <SortableContext
 items={nodes.map((node) => node.id)}
 strategy={verticalListSortingStrategy}
 >
 {nodes.length === 0 ? (
 <div className="rounded-md border-2 border-dashed border-input bg-background/70 px-5 py-10 text-center text-sm text-muted-foreground sm:ml-24">
 Chưa có hoạt động trong ngày này.
 </div>
 ) : (
 nodes.map((node, nodeIndex) => (
 <SortableNode
 key={node.id}
 id={node.id}
 node={node}
 dayId={day.id}
 index={nodeIndex}
 >
 {(dragHandleProps) => node.type === "TIMELINE_ITEM" ? (
 <TimelineItem
 node={node}
 dayDate={day.date}
 tripStatus={tripStatus}
 placesDict={placesDict}
 servicesDict={servicesDict}
 dragHandleProps={dragHandleProps}
 onEdit={() => onEdit(day.id, node)}
 onDelete={() => onDelete(day.id, node.id)}
 />
 ) : node.type === "TRAVEL_SEGMENT" ? (
 <TravelSegment node={node} />
 ) : node.type === "LOCATION_CANVAS" ? (
 <LocationCanvas node={node} placesDict={placesDict} />
 ) : null}
 </SortableNode>
 ))
 )}
 </SortableContext>
 </div>
 </section>
 );
}

function ActivityEditor({ dayId, node, placesDict, servicesDict, onClose, onDelete, onSave, timelineDays }) {
 const currentItem = node?.item;
 const currentResource = currentItem?.placeId
 ? `place:${currentItem.placeId}`
 : currentItem?.serviceId
 ? `service:${currentItem.serviceId}`
 : '';
 const [form, setForm] = useState({
 dayId: dayId || timelineDays?.[0]?.id || '',
 resource: currentResource,
 title: currentItem?.title || '',
 startTime: currentItem?.startTime || '',
 endTime: currentItem?.endTime || '',
 estimatedCost: currentItem?.estimatedCost || 0,
 note: currentItem?.note || '',
 });

 const resources = [
 ...Object.values(placesDict).map((place) => ({
 key: `place:${place.id}`,
 label: `Địa điểm · ${place.name}`,
 price: 0,
 })),
 ...Object.values(servicesDict).map((service) => ({
 key: `service:${service.id}`,
 label: `Dịch vụ · ${service.name}`,
 price: service.price || 0,
 })),
 ].sort((left, right) => left.label.localeCompare(right.label, 'vi'));

 const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
 const handleResourceChange = (value) => {
 const selected = resources.find((resource) => resource.key === value);
 setForm((current) => ({
 ...current,
 resource: value,
 estimatedCost: node ? current.estimatedCost : selected?.price || 0,
 }));
 };

 const handleSubmit = (event) => {
 event.preventDefault();
 if (!form.resource) return;
 const [kind, id] = form.resource.split(':');
 onSave({
 dayId: form.dayId,
 node,
 item: {
 ...(kind === 'place' ? { placeId: id } : { serviceId: id }),
 title: form.title.trim() || undefined,
 startTime: form.startTime || undefined,
 endTime: form.endTime || undefined,
 estimatedCost: kind === 'service' ? Math.max(0, Number(form.estimatedCost) || 0) : 0,
 note: form.note.trim() || undefined,
 },
 });
 };

 return (
 <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6" role="presentation">
 <section className="w-full max-w-lg rounded-t-2xl bg-background shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="activity-editor-title">
 <header className="flex items-center justify-between border-b border-border px-5 py-4">
 <h2 id="activity-editor-title" className="text-lg font-bold text-foreground">
 {node ? 'Sửa hoạt động' : 'Thêm hoạt động'}
 </h2>
 <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={onClose} aria-label="Đóng">
 <X className="h-5 w-5" aria-hidden="true" />
 </button>
 </header>
 <form className="space-y-4 p-5" onSubmit={handleSubmit}>
 <label className="block text-sm font-semibold text-muted-foreground">
 Tài nguyên
 <select
 className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
 value={form.resource}
 onChange={(event) => handleResourceChange(event.target.value)}
 required
 >
 <option value="">Chọn địa điểm hoặc dịch vụ</option>
 {resources.map((resource) => <option key={resource.key} value={resource.key}>{resource.label}</option>)}
 </select>
 </label>
 <label className="block text-sm font-semibold text-muted-foreground">
 Ngày chèn
 <select
 className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
 value={form.dayId}
 onChange={(event) => updateField('dayId', event.target.value)}
 required
 >
 {timelineDays?.map((day, index) => (
 <option key={day.id} value={day.id}>
 Ngày {Number(day.sequence ?? index) + 1} - {formatDay(day.date)}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-sm font-semibold text-muted-foreground">
 Tên hiển thị
 <input className="mt-1.5 h-11 w-full rounded-lg border border-input px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Ví dụ: Ăn trưa tại Hội An" />
 </label>
 <div className="grid grid-cols-2 gap-3">
 <label className="block text-sm font-semibold text-muted-foreground">Bắt đầu<input type="time" className="mt-1.5 h-11 w-full rounded-lg border border-input px-3 text-sm" value={form.startTime} onChange={(event) => updateField('startTime', event.target.value)} /></label>
 <label className="block text-sm font-semibold text-muted-foreground">Kết thúc<input type="time" className="mt-1.5 h-11 w-full rounded-lg border border-input px-3 text-sm" value={form.endTime} onChange={(event) => updateField('endTime', event.target.value)} /></label>
 </div>
 <label className="block text-sm font-semibold text-muted-foreground">
 Chi phí dự kiến (đ)
 <input type="number" min="0" step="1000" className="mt-1.5 h-11 w-full rounded-lg border border-input px-3 text-sm" value={form.estimatedCost} onChange={(event) => updateField('estimatedCost', event.target.value)} />
 </label>
 <label className="block text-sm font-semibold text-muted-foreground">
 Ghi chú
 <textarea className="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-input p-3 text-sm" value={form.note} onChange={(event) => updateField('note', event.target.value)} />
 </label>
 <div className="flex items-center justify-between gap-3 pt-1">
 {node ? <Button type="button" variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={onDelete}>Xóa hoạt động</Button> : <span />}
 <div className="flex gap-3">
 <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
 <Button type="submit">{node ? 'Lưu thay đổi' : 'Thêm vào lịch trình'}</Button>
 </div>
 </div>
 </form>
 </section>
 </div>
 );
}

function BudgetSummary({ budget, spent, onChange }) {
 const [editing, setEditing] = useState(false);
 const [value, setValue] = useState(budget || 0);
 const remaining = budget - spent;

 const submit = async (event) => {
 event.preventDefault();
 await onChange(Math.max(0, Number(value) || 0));
 setEditing(false);
 };

 return (
 <section className="mb-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
 <div className="grid grid-cols-3 divide-x divide-slate-200">
 <div className="p-3 sm:p-4"><div className="text-[11px] text-muted-foreground sm:text-xs">Tổng chi phí</div><strong className="mt-1 block truncate text-sm text-amber-600 sm:text-lg">{formatCurrency(spent)}</strong></div>
 <button type="button" className="p-3 text-left hover:bg-background sm:p-4" onClick={() => { setValue(budget); setEditing(true); }}><div className="flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs"><Wallet className="h-3.5 w-3.5" /> Ngân sách</div><strong className="mt-1 block truncate text-sm text-blue-600 sm:text-lg">{formatCurrency(budget)}</strong></button>
 <div className="p-3 sm:p-4"><div className="text-[11px] text-muted-foreground sm:text-xs">Còn lại</div><strong className={`mt-1 block truncate text-sm sm:text-lg ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatCurrency(remaining)}</strong></div>
 </div>
 {remaining < 0 ? <div className="flex items-center gap-2 border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700"><AlertTriangle className="h-4 w-4" /> Vượt ngân sách {formatCurrency(Math.abs(remaining))}</div> : null}
 {editing ? (
 <form className="flex items-end gap-3 border-t border-border bg-background p-3" onSubmit={submit}>
 <label className="min-w-0 flex-1 text-xs font-semibold text-muted-foreground">Ngân sách mới<input autoFocus type="number" min="0" step="100000" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" /></label>
 <Button type="submit" size="sm">Cập nhật</Button>
 </form>
 ) : null}
 </section>
 );
}

export default function PlannerTimeline({ timelineDays, onOpenResources, onBudgetChange = async () => {} }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const placesDict = useAppSelector((state) => state.trip.placesDictionary);
 const servicesDict = useAppSelector((state) => state.trip.servicesDictionary);
 const budgetSummary = useAppSelector((state) => state.trip.budgetSummary);
 const activeTrip = useAppSelector((state) => state.trip.activeTrip);
 const user = useAppSelector((state) => state.auth.user);
 
 const [optimizeRoute, { isLoading: isOptimizing }] = useOptimizeRouteMutation();
 const [selectedDayId, setSelectedDayId] = useState(null);
 const [editor, setEditor] = useState(null);
 const activeDayId = timelineDays.some((day) => day.id === selectedDayId)
 ? selectedDayId
 : timelineDays[0]?.id;

 const handleOptimize = async () => {
 const isPremium = activeTrip && (user?.isPremium || ['PREMIUM_TRAVELER', 'PROVIDER_APPROVED', 'ADMIN'].includes(user?.role));
 if (!isPremium) {
 Swal.fire({
 title: "Tính năng Premium",
 text: "Bạn cần nâng cấp lên tài khoản Premium để sử dụng tính năng tối ưu lộ trình bằng AI.",
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
 const result = await optimizeRoute({ tripId: numericTripId }).unwrap();
 if (result.success && result.optimizedOrder) {
 const orderMap = new Map(
 result.optimizedOrder.map((id, index) => [String(id), index])
 );

 const newDays = timelineDays.map((day) => {
 const sortedNodes = [...(day.nodes || [])].sort((a, b) => {
 if (a.type !== "TIMELINE_ITEM" || b.type !== "TIMELINE_ITEM") return 0;
 const idxA = orderMap.get(a.item.id) ?? 999;
 const idxB = orderMap.get(b.item.id) ?? 999;
 return idxA - idxB;
 });

 const resequenced = sortedNodes.map((node, idx) => ({
 ...node,
 sequence: idx,
 item: { ...node.item, sequence: idx },
 }));

 return { ...day, nodes: resequenced };
 });

 dispatch(setTimelineDays(newDays));
 Swal.fire("Thành công", result.summary || "Đã tối ưu hóa lộ trình di chuyển thành công!", "success");
 } else {
 Swal.fire("Lỗi", result.message || "Không thể tối ưu lộ trình.", "error");
 }
 } catch (err) {
 Swal.fire("Lỗi", "Không thể tối ưu lộ trình.", "error");
 }
 };

 if (timelineDays.length === 0) {
 return (
 <div className="mx-auto flex min-h-[420px] max-w-xl flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/70 px-6 text-center">
 <CalendarPlus className="h-9 w-9 text-slate-300" aria-hidden="true" />
 <h2 className="mt-4 font-bold text-foreground">Lịch trình chưa có ngày</h2>
 <p className="mt-2 text-sm leading-6 text-muted-foreground">
 Thêm tài nguyên sau khi chuyến đi có ngày bắt đầu và kết thúc.
 </p>
 {onOpenResources ? (
 <Button type="button" className="mt-5" onClick={onOpenResources}>
 Mở tài nguyên
 </Button>
 ) : null}
 </div>
 );
 }

 const handleEditorSave = ({ dayId, node, item }) => {
 if (node) {
 dispatch(updateTimelineItem({ dayId, nodeId: node.id, changes: item }));
 } else {
 const selected = timelineDays.find((day) => day.id === dayId);
 dispatch(insertTimelineNode({
 dayId,
 index: selected?.nodes?.length || 0,
 node: {
 id: `node-${crypto.randomUUID()}`,
 type: 'TIMELINE_ITEM',
 sequence: selected?.nodes?.length || 0,
 item: {
 id: `item-${crypto.randomUUID()}`,
 dayId,
 sequence: selected?.nodes?.length || 0,
 ...item,
 },
 },
 }));
 }
 setEditor(null);
 };

 const handleDelete = (dayId, nodeId) => {
 console.log('Bấm xóa:', { dayId, nodeId });
 if (window.confirm('Xóa hoạt động này khỏi lịch trình?')) {
 console.log('Dispatching removeTimelineNode...');
 dispatch(removeTimelineNode({ dayId, nodeId }));
 setEditor(null);
 }
 };

 return (
 <div className="mx-auto max-w-4xl pb-24">
 <div className="mb-5 flex gap-2 overflow-x-auto md:hidden" role="tablist" aria-label="Ngày trong chuyến đi">
 {timelineDays.map((day, index) => {
 const selected = day.id === activeDayId;
 return (
 <button
 key={day.id}
 type="button"
 role="tab"
 aria-selected={selected}
 className={`shrink-0 rounded-md border px-3 py-2 text-sm font-semibold ${
 selected
 ? "border-primary bg-primary text-white"
 : "border-input bg-background text-muted-foreground"
 }`}
 onClick={() => setSelectedDayId(day.id)}
 >
 Ngày {Number(day.sequence ?? index) + 1}
 </button>
 );
 })}
 </div>

 <BudgetSummary
 budget={Number(activeTrip?.totalBudget || 0)}
 spent={Number(budgetSummary.total || 0)}
 onChange={onBudgetChange}
 />

 <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
 <h2 className="text-2xl font-bold text-foreground">Lịch trình</h2>
 <div className="flex gap-2">
 <Button 
 type="button" 
 variant="outline" 
 className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800" 
 onClick={handleOptimize}
 disabled={isOptimizing}
 >
 {isOptimizing ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Sparkles className="h-4 w-4" />
 )}
 Tối ưu lộ trình (AI)
 </Button>
 <Button type="button" variant="ghost" className="gap-2 text-primary hover:bg-primary/5" onClick={() => setEditor({ dayId: activeDayId, node: null })}>
 <Plus className="h-5 w-5" aria-hidden="true" />
 Thêm hoạt động
 </Button>
 </div>
 </div>

 <div className="space-y-10 md:space-y-14">
 {timelineDays.map((day, index) => (
 <DaySection
 key={day.id}
 day={day}
 index={index}
 tripStatus={activeTrip?.status}
 placesDict={placesDict}
 servicesDict={servicesDict}
 isSelected={day.id === activeDayId}
 onEdit={(dayId, node) => setEditor({ dayId, node })}
 onDelete={handleDelete}
 />
 ))}
 </div>
 {editor ? (
 <ActivityEditor
 dayId={editor.dayId}
 node={editor.node}
 placesDict={placesDict}
 servicesDict={servicesDict}
 timelineDays={timelineDays}
 onClose={() => setEditor(null)}
 onDelete={() => {
 handleDelete(editor.dayId, editor.node.id);
 setEditor(null);
 }}
 onSave={handleEditorSave}
 />
 ) : null}
 </div>
 );
}
