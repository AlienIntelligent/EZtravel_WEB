import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CalendarDays, Loader2, Map as MapIcon, PanelLeft, Plus, Wallet } from "lucide-react";
import {
 DndContext,
 DragOverlay,
 PointerSensor,
 useSensor,
 useSensors,
 pointerWithin,
 closestCenter,
 closestCorners
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
 moveTimelineNode,
 setActiveTrip,
 setDictionaries,
 setSaveState,
 setScratchpad,
 setTimelineDays,
} from '../../store/tripSlice';
import {
 useCreateTripMutation,
 useGetTripByIdQuery,
 useUpdateTripMutation,
 useUpdateTripTimelineMutation,
} from '../../store/apis/plannerApi';
import { useGetExploreGridQuery, useLazyGetExploreGridQuery, useLazyGetNearbyResourcesQuery } from '../../store/apis/exploreApi';
import PlannerSidebar from './components/PlannerSidebar';
import PlannerTimeline from './components/PlannerTimeline';
import PlannerRightPanel from './components/PlannerRightPanel';
import TopPlannerBar from './components/TopPlannerBar';
import { handleDnDDrop } from './services/plannerMutationService';
import PlannerMap from "./components/map/PlannerMap";
import BudgetPanel from "./components/BudgetPanel";

const serviceIdentity = (item) => {
 if (item.maKhachSan) return { id: item.maKhachSan, type: 'ACCOMMODATION' };
 if (item.maNhaHang) return { id: item.maNhaHang, type: 'FOOD' };
 if (item.maHoatDong) return { id: item.maHoatDong, type: 'ACTIVITY' };
 if (item.maPhuongTien) return { id: item.maPhuongTien, type: 'TRANSPORT' };
 return null;
};

const mapTripToPlanner = (trip) => {
 const places = new Map();
 const services = new Map();
 const tripId = String(trip.id);

 const days = (trip.days || []).map((day, dayIndex) => {
 const dayId = String(day.maNgay ?? `${tripId}-${dayIndex + 1}`);
 const nodes = (day.items || []).map((item, itemIndex) => {
 const service = serviceIdentity(item);
 const sequence = Number(item.thuTu ?? itemIndex + 1) - 1;
 const title = item.tieuDe || item.tenDiaDiem || 'Hoạt động';

 if (service) {
 const serviceId = String(service.id);
 services.set(serviceId, {
 id: serviceId,
 name: title,
 type: service.type,
 providerId: '',
 placeId: String(item.maDiaDiem || ''),
 price: Number(item.chiPhiDuKien || 0),
 images: []
 });

 return {
 id: `service-${item.id}`,
 type: 'TIMELINE_ITEM',
 sequence,
 item: {
 id: String(item.id),
 dayId,
 serviceId,
 title,
 sequence,
 startTime: item.startTime,
 endTime: item.endTime,
 note: item.ghiChu,
 estimatedCost: Number(item.chiPhiDuKien || 0)
 }
 };
 }

 const placeId = String(item.maDiaDiem ?? item.id);
 places.set(placeId, {
 id: placeId,
 name: item.tenDiaDiem || title,
 type: 'ATTRACTION',
 location: { address: '' }
 });

 return {
 id: `place-${item.id}`,
 type: 'TIMELINE_ITEM',
 sequence,
 item: {
 id: String(item.id),
 dayId,
 placeId,
 title,
 sequence,
 startTime: item.startTime,
 endTime: item.endTime,
 note: item.ghiChu
 }
 };
 });

 return {
 id: dayId,
 tripId,
 date: day.ngay || trip.ngayBatDau,
 sequence: Number(day.soThuTu ?? dayIndex + 1) - 1,
 nodes,
 createdAt: trip.ngayCapNhat || new Date().toISOString(),
 updatedAt: trip.ngayCapNhat || new Date().toISOString()
 };
 });

 return {
 trip: {
 id: tripId,
 userId: String(trip.userId || ''),
 title: trip.tenLichTrinh || trip.title || 'Lịch trình',
 description: trip.moTa || '',
 startDate: trip.ngayBatDau,
 endDate: trip.ngayKetThuc,
 visibility: trip.laCongKhai ? 'PUBLIC' : 'PRIVATE',
 totalBudget: Number(trip.nganSachToiDa ?? trip.budgetLimit ?? trip.budget ?? 0),
 status: trip.trangThai || 'DRAFT',
 createdAt: trip.ngayTao || trip.ngayCapNhat,
 updatedAt: trip.ngayCapNhat
 },
 days,
 places: [...places.values()],
 services: [...services.values()]
 };
};

const getItems = (payload) => {
 if (Array.isArray(payload)) return payload;
 return payload?.items || payload?.data || [];
};

const serviceIdField = (type) => {
 if (type === 'ACCOMMODATION') return 'maKhachSan';
 if (type === 'FOOD') return 'maNhaHang';
 if (type === 'ACTIVITY') return 'maHoatDong';
 if (type === 'TRANSPORT') return 'maPhuongTien';
 return null;
};

const serializeTimelineDays = (days, servicesDictionary) => days.map((day, dayIndex) => {
 const items = [];

 const pushItem = (item, itemIndex, fallbackPlaceId) => {
 const payload = {
 id: 0,
 maNgay: 0,
 maDiaDiem: item.placeId ? Number(item.placeId) : fallbackPlaceId ? Number(fallbackPlaceId) : undefined,
 tieuDe: item.title || undefined,
 startTime: item.startTime || undefined,
 endTime: item.endTime || undefined,
 thuTu: itemIndex + 1,
 ghiChu: item.note || undefined,
 chiPhiDuKien: Number(item.estimatedCost || 0),
 };

 if (item.serviceId) {
 const service = servicesDictionary[item.serviceId];
 const field = serviceIdField(service?.type);
 if (!field) return;
 payload[field] = Number(item.serviceId);
 payload.maDiaDiem = Number(service?.placeId || payload.maDiaDiem) || undefined;
 }

 if (!payload.maDiaDiem && !item.serviceId) return;
 items.push(payload);
 };

 (day.nodes || []).forEach((node) => {
 if (node.type === 'TIMELINE_ITEM') {
 pushItem(node.item, items.length);
 } else if (node.type === 'LOCATION_CANVAS') {
 const grouped = Object.values(node.groups || {}).flatMap((group) => group.items || []);
 if (grouped.length === 0) {
 pushItem(node.anchorPlace, items.length);
 } else {
 grouped.forEach((item) => pushItem(item, items.length, node.anchorPlace?.placeId));
 }
 }
 });

 return {
 maNgay: 0,
 ngay: day.date,
 soThuTu: dayIndex + 1,
 ghiChu: day.note || undefined,
 items,
 };
});

function TripPlannerWorkspace() {
 const dispatch = useAppDispatch();
 const { id: routeTripId } = useParams();
 const location = useLocation();
 const routerState = location.state || {};
 const {
  activeTrip,
  lastSavedAt,
  saveStatus,
  servicesDictionary,
  timelineDays: reduxTimelineDays,
 } = useAppSelector((state) => state.trip);

 const [localTimelineDays, setLocalTimelineDays] = useState(reduxTimelineDays);

 // API Hooks
 const tripId = routeTripId || activeTrip?.id || '';
 const numericTripId = Number(tripId);
 const { data: tripData, isLoading, isError, refetch } = useGetTripByIdQuery(numericTripId, { skip: !tripId || Number.isNaN(numericTripId) });
 const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
 const [updateTimeline] = useUpdateTripTimelineMutation();
 const [updateTrip] = useUpdateTripMutation();
 const { data: placesData } = useGetExploreGridQuery({ type: 'destination', pageSize: 40 });
 const { data: servicesData } = useGetExploreGridQuery({ type: 'services', pageSize: 60 });
 const [getNearby] = useLazyGetNearbyResourcesQuery();
 const [getExploreGrid] = useLazyGetExploreGridQuery();
 const [mobileMode, setMobileMode] = useState("timeline");
 const hydratedTripIdRef = useRef(null);
 const savedSignatureRef = useRef(null);
 const saveTimerRef = useRef(null);
 const fetchedProvincesRef = useRef(false);

 useEffect(() => {
 if (!tripData) return;

 const planner = mapTripToPlanner(tripData);
 const serviceDictionary = Object.fromEntries(planner.services.map((service) => [service.id, service]));
 const isFirstHydration = hydratedTripIdRef.current !== planner.trip.id;
 hydratedTripIdRef.current = planner.trip.id;
 savedSignatureRef.current = JSON.stringify(serializeTimelineDays(planner.days, serviceDictionary));
 dispatch(setActiveTrip(planner.trip));
 dispatch(setTimelineDays(planner.days));
 dispatch(setDictionaries({ places: planner.places, services: planner.services }));
 if (isFirstHydration) {
 dispatch(setSaveState({ status: 'IDLE', savedAt: null }));
 }
 }, [dispatch, tripData]);

 useEffect(() => {
   if (!activeTrip || fetchedProvincesRef.current) return;
   
   const startId = routerState.maTinhXuatPhat;
   const turnId = routerState.maTinhQuayDau;
   const endId = routerState.maTinhKetThuc;
   
   const provinceIds = [startId, turnId, endId].filter(id => id);
   const uniqueProvinces = [...new Set(provinceIds)];

   if (uniqueProvinces.length > 0) {
      fetchedProvincesRef.current = true;
      Promise.all(uniqueProvinces.map(async (pId) => {
          const [placesRes, servicesRes] = await Promise.all([
             getExploreGrid({ type: 'places', maTinhThanh: pId, pageSize: 10000 }).unwrap().catch(() => ({ data: [] })),
             getExploreGrid({ type: 'services', maTinhThanh: pId, pageSize: 10000 }).unwrap().catch(() => ({ data: [] }))
          ]);
          return { places: placesRes.data || [], services: servicesRes.data || [] };
      })).then(results => {
          const allPlaces = results.flatMap(r => r.places);
          const allServices = results.flatMap(r => r.services);
          
          const mappedPlaces = allPlaces.map(p => ({
              id: String(p.id),
              name: p.name || p.tenDiaDiem,
              type: p.type || 'ATTRACTION',
              imageUrl: p.thumbnail || p.imageUrl || '',
              location: { address: p.address || p.diaChi || '' }
          }));
          
          const mappedServices = allServices.map(s => ({
              id: String(s.id),
              name: s.name || s.tenKhachSan || s.tenNhaHang || s.tenHoatDong || s.tenPhuongTien,
              type: s.type || 'SERVICE',
              providerId: s.providerId || '',
              placeId: String(s.placeId || ''),
              price: Number(s.price || s.giaThamKhao || 0),
              images: s.images || []
          }));

          dispatch(setDictionaries({ places: mappedPlaces, services: mappedServices }));
          dispatch({ type: 'trip/appendScratchpad', payload: {
            places: mappedPlaces.map((p, index) => ({
              id: `resource-place-${p.id}`,
              dayId: '',
              placeId: p.id,
              sequence: index,
            })),
            services: mappedServices.map((s, index) => ({
              id: `resource-service-${s.id}`,
              dayId: '',
              serviceId: s.id,
              sequence: index,
              estimatedCost: s.price || 0,
            })),
          }});
      });
   }
  }, [dispatch, activeTrip, routerState, getExploreGrid]);

 useEffect(() => {
 if (fetchedProvincesRef.current) return;
 const placeRows = getItems(placesData);
 const serviceRows = getItems(servicesData);
 if (placeRows.length === 0 && serviceRows.length === 0) return;

 const places = placeRows.map((place) => ({
 id: String(place.id),
 name: place.name,
 type: 'ATTRACTION',
 imageUrl: place.images?.[0] || place.thumbnailUrl || '',
 latitude: place.latitude,
 longitude: place.longitude,
 location: { address: place.address || '' },
 }));
 const services = serviceRows.map((service) => ({
 id: String(service.id),
 name: service.name,
 type: service.type,
 providerId: String(service.providerId || ''),
 placeId: String(service.placeId || service.maDiaDiem || ''),
 price: Number(service.price || 0),
 images: service.images || [],
 imageUrl: service.images?.[0] || service.thumbnail || '',
 }));

 dispatch(setDictionaries({ places, services }));
 dispatch(setScratchpad({
 places: places.map((place, index) => ({
 id: `resource-place-${place.id}`,
 dayId: '',
 placeId: place.id,
 sequence: index,
 })),
 services: services.map((service, index) => ({
 id: `resource-service-${service.id}`,
 dayId: '',
 serviceId: service.id,
 sequence: index,
 estimatedCost: service.price || 0,
 })),
 }));
 }, [dispatch, placesData, servicesData]);

 useEffect(() => {
 if (!activeTrip || !tripId || savedSignatureRef.current == null) return undefined;

 const days = serializeTimelineDays(reduxTimelineDays, servicesDictionary);
 const signature = JSON.stringify(days);
 if (signature === savedSignatureRef.current) return undefined;

 dispatch(setSaveState({ status: 'SAVING' }));
 window.clearTimeout(saveTimerRef.current);
 saveTimerRef.current = window.setTimeout(async () => {
 try {
 await updateTimeline({
 id: numericTripId,
 body: { tripId: numericTripId, days },
 }).unwrap();
 savedSignatureRef.current = signature;
 dispatch(setSaveState({
 status: 'SAVED',
 savedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
 }));
 } catch {
 dispatch(setSaveState({ status: 'ERROR' }));
 }
 }, 700);

 return () => window.clearTimeout(saveTimerRef.current);
 }, [activeTrip, dispatch, numericTripId, servicesDictionary, reduxTimelineDays, tripId, updateTimeline]);

 const handleBudgetChange = async (budget) => {
 dispatch(setSaveState({ status: 'SAVING' }));
 try {
 await updateTrip({ id: numericTripId, body: { budget } }).unwrap();
 dispatch(setActiveTrip({ ...activeTrip, totalBudget: budget }));
 dispatch(setSaveState({
 status: 'SAVED',
 savedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
 }));
 } catch {
 dispatch(setSaveState({ status: 'ERROR' }));
 }
 };

 const handleCreateTrip = async () => {
 try {
 const newTrip = await createTrip({
 title: "Khám phá chuyến đi mới",
 startDate: new Date().toISOString(),
 endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
 visibility: 'PRIVATE'
 }).unwrap();
 dispatch(setActiveTrip(newTrip));
 } catch (err) {
 console.error("Lỗi khi tạo lịch trình mới", err);
 alert("Có lỗi xảy ra khi tạo lịch trình!");
 }
 };

 const [activeId, setActiveId] = useState(null);
 const [activeDragData, setActiveDragData] = useState(null);

 useEffect(() => {
   if (!activeId) {
     setLocalTimelineDays(reduxTimelineDays);
   }
 }, [reduxTimelineDays, activeId]);

 const sensors = useSensors(
   useSensor(PointerSensor, {
     activationConstraint: {
       distance: 5
     }
   })
 );

 const handleDragStart = (event) => {
   setActiveId(event.active.id);
   setActiveDragData(event.active.data.current);
 };

 const handleDragOver = (event) => {
   const { active, over } = event;
   const overId = over?.id;

   if (!overId) return;

   const activeContainer = active.data.current?.dayId || 'sidebar';
   const overContainer = over.data.current?.dayId || (over.data.current?.type === 'DAY_CONTAINER' ? over.id : null);

   if (!overContainer || activeContainer === overContainer) {
     return;
   }

   setLocalTimelineDays((prev) => {
     let activeItem;
     if (activeContainer === 'sidebar') {
       activeItem = {
         id: active.id,
         type: 'TIMELINE_ITEM',
         item: active.data.current?.item
       };
     } else {
       for (const day of prev) {
         const node = day.nodes?.find(n => n.id === active.id);
         if (node) { activeItem = node; break; }
       }
     }

     if (!activeItem) return prev;

     const isOverItem = over.data.current?.type === 'TIMELINE_ITEM';
     let overIndex = -1;
     
     if (isOverItem) {
        const targetDay = prev.find(d => d.id === overContainer);
        overIndex = targetDay?.nodes?.findIndex(n => n.id === over.id) ?? -1;
     }

     return prev.map(day => {
       let newNodes = [...(day.nodes || [])];
       
       if (day.id === activeContainer) {
         newNodes = newNodes.filter(n => n.id !== active.id);
       }
       
       if (day.id === overContainer) {
         newNodes = newNodes.filter(n => n.id !== active.id);
         const targetIndex = overIndex >= 0 ? overIndex : newNodes.length;
         newNodes.splice(targetIndex, 0, activeItem);
       }
       
       return { ...day, nodes: newNodes };
     });
   });
 };

 const handleDragEnd = async (event) => {
   setActiveId(null);
   setActiveDragData(null);
   const { active, over } = event;
   
   if (!over) {
     setLocalTimelineDays(reduxTimelineDays);
     return;
   }

   const draggedItemType = active.data?.current?.type;
   const activeContainer = active.data?.current?.dayId || 'sidebar';
   const overContainer = over.data?.current?.dayId || (over.data?.current?.type === 'DAY_CONTAINER' ? over.id : null);

   if (!overContainer) {
     setLocalTimelineDays(reduxTimelineDays);
     return;
   }

   // Lấy vị trí index từ state local mới nhất
   const targetDay = localTimelineDays.find((day) => day.id === overContainer);
   const targetIndex = targetDay?.nodes?.findIndex(n => n.id === active.id) ?? targetDay?.nodes?.length ?? 0;

   if (draggedItemType === 'TIMELINE_ITEM') {
     if (activeContainer !== 'sidebar') {
       dispatch(moveTimelineNode({
         sourceDayId: activeContainer,
         targetDayId: overContainer,
         nodeId: String(active.id),
         targetIndex,
       }));
     }
     return;
   }

 if (draggedItemType === 'PLACE') {
  const item = active.data?.current?.item;
  handleDnDDrop(event, item, dispatch, servicesDictionary, overContainer, targetIndex);
  
  if (overContainer) {
    const placeId = Number(item.placeId);
    if (!isNaN(placeId)) {
      getNearby(placeId).unwrap().then(res => {
        const places = res.places || [];
        const services = [...(res.hotels || []), ...(res.restaurants || []), ...(res.activities || []), ...(res.transports || [])];
        
        const mappedPlaces = places.map((p) => ({
          id: String(p.id),
          name: p.name,
          type: 'ATTRACTION',
          imageUrl: p.images?.[0] || p.thumbnailUrl || '',
          latitude: p.latitude,
          longitude: p.longitude,
          location: { address: p.address || '' },
        }));
        
        const mappedServices = services.map((s) => ({
          id: String(s.id),
          name: s.name,
          type: s.type,
          providerId: String(s.providerId || ''),
          placeId: String(s.placeId || s.maDiaDiem || ''),
          price: Number(s.price || 0),
          images: s.images || [],
          imageUrl: s.images?.[0] || s.thumbnail || '',
        }));

        dispatch(setDictionaries({ places: mappedPlaces, services: mappedServices }));
        dispatch({ type: 'trip/appendScratchpad', payload: {
          places: mappedPlaces.map((p, index) => ({
            id: `resource-place-${p.id}`,
            dayId: '',
            placeId: p.id,
            sequence: index,
          })),
          services: mappedServices.map((s, index) => ({
            id: `resource-service-${s.id}`,
            dayId: '',
            serviceId: s.id,
            sequence: index,
            estimatedCost: s.price || 0,
          })),
        }});
      }).catch(err => console.error("Lỗi khi fetch nearby resources", err));
    }
  }
 } else if (draggedItemType === 'SERVICE') {
 const item = active.data?.current?.item;
 handleDnDDrop(event, item, dispatch, servicesDictionary, overContainer, targetIndex);
 }
 };

 if (isLoading) {
 return (
 <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background h-full w-full">
 <Loader2 className="mb-4 h-9 w-9 animate-spin text-primary" aria-hidden="true" />
 <p className="text-sm font-medium text-muted-foreground">Đang tải dữ liệu chuyến đi...</p>
 </div>
 );
 }

 if (isError) {
 return (
 <div className="flex-1 flex flex-col items-center justify-center gap-4 p-5 bg-background h-full w-full">
 <h1 className="text-2xl font-bold text-heading">Không thể tải lịch trình</h1>
 <button className="border border-border rounded-md px-4 py-2" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 );
 }

 if (!activeTrip) {
 return (
 <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background h-full w-full">
 <CalendarDays className="mb-5 h-10 w-10 text-slate-300" aria-hidden="true" />
 <h3 className="mb-3 text-2xl font-bold text-heading">Bắt đầu chuyến hành trình tự túc</h3>
 <p className="mb-6 max-w-md text-center text-sm leading-6 text-muted-foreground">Tạo một lịch trình mới hoặc chọn chuyến đi có sẵn từ danh sách.</p>
 <button
 className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-semibold transition-colors shadow-sm"
 onClick={handleCreateTrip}
 disabled={isCreating}>
 <span className="inline-flex items-center gap-2">
 {isCreating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
 {isCreating ? "Đang tạo..." : "Tạo lịch trình"}
 </span>
 </button>
 </div>
 );
 }

 return (
 <DndContext
 sensors={sensors}
 collisionDetection={closestCorners}
 onDragStart={handleDragStart}
 onDragOver={handleDragOver}
 onDragEnd={handleDragEnd}
 onDragCancel={() => {
   setActiveId(null);
   setActiveDragData(null);
   setLocalTimelineDays(reduxTimelineDays);
 }}>
 
 <div className="flex-1 flex flex-col overflow-hidden w-full h-full bg-background">
 <TopPlannerBar
 tripName={activeTrip.title}
 status={activeTrip.status}
 lastUpdated={lastSavedAt || "chưa lưu"}
 saveStatus={saveStatus}
 onStartTrip={async () => {
    if (!window.confirm("Bắt đầu chuyến đi ngay bây giờ? Tiến độ sẽ được tự động cập nhật theo thời gian thực.")) return;
    dispatch(setSaveState({ status: 'SAVING' }));
    try {
      await updateTrip({ id: numericTripId, body: { status: 'IN_PROGRESS' } }).unwrap();
      dispatch(setActiveTrip({ ...activeTrip, status: 'IN_PROGRESS' }));
      dispatch(setSaveState({
        status: 'SAVED',
        savedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }));
    } catch {
      dispatch(setSaveState({ status: 'ERROR' }));
      alert("Lỗi khi cập nhật trạng thái.");
    }
 }}
 onShare={() => alert("Tính năng chia sẻ đang được phát triển.")} />
 

 <div className="hidden min-h-0 flex-1 overflow-hidden md:flex">
 <aside className="hidden w-[20%] min-w-[260px] max-w-[320px] shrink-0 flex-col border-r border-border bg-background md:flex">
 <div className="min-h-0 flex-1 overflow-y-auto p-4">
 <PlannerSidebar />
 </div>
 </aside>

 <main className="relative flex min-w-0 flex-1 flex-col border-r border-border bg-background/70">
 <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-6">
 <PlannerTimeline timelineDays={localTimelineDays} onBudgetChange={handleBudgetChange} />
 </div>
 </main>

 <PlannerRightPanel />
 </div>

 <div className="flex min-h-0 flex-1 flex-col md:hidden">
 <main className="min-h-0 flex-1 overflow-y-auto bg-background/70 p-4">
 {mobileMode === "resources" ? (
 <PlannerSidebar />
 ) : mobileMode === "map" ? (
 <div className="h-full min-h-[420px] overflow-hidden rounded-md border border-border bg-background">
 <PlannerMap />
 </div>
 ) : mobileMode === "budget" ? (
 <BudgetPanel />
 ) : (
 <PlannerTimeline
 timelineDays={localTimelineDays}
 onBudgetChange={handleBudgetChange}
 onOpenResources={() => setMobileMode("resources")}
 />
 )}
 </main>

 <nav className="grid h-16 shrink-0 grid-cols-4 border-t border-border bg-background" aria-label="Chế độ planner">
 {[
 ["resources", PanelLeft, "Tài nguyên"],
 ["timeline", CalendarDays, "Lịch trình"],
 ["map", MapIcon, "Bản đồ"],
 ["budget", Wallet, "Chi phí"],
 ].map(([mode, Icon, label]) => {
 const active = mobileMode === mode;
 return (
 <button
 key={mode}
 type="button"
 className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
 active ? "text-primary" : "text-muted-foreground"
 }`}
 aria-current={active ? "page" : undefined}
 onClick={() => setMobileMode(mode)}
 >
 <Icon className="h-4 w-4" aria-hidden="true" />
 <span className="truncate">{label}</span>
 </button>
 );
 })}
 </nav>
 </div>
 </div>

 <DragOverlay modifiers={[snapCenterToCursor]}>
 {activeId ? (
 <div className="rounded-md border border-primary bg-background p-3 text-sm font-medium shadow-lg opacity-90">
 Đang kéo mục...
 </div>
 ) : null}
 </DragOverlay>
 </DndContext>);

}

export default TripPlannerWorkspace;
