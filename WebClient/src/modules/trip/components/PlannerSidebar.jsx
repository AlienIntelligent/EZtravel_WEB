import { useState } from "react";
import { useAppSelector } from '../../../store/hooks';
import { Search, MapPin, BedDouble, Utensils, Activity, Car, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';









const DraggableItem = ({ item, itemType }) => {
 const { attributes, listeners, setNodeRef, transform } = useDraggable({
 id: `sidebar-${itemType}-${item.id}`,
 data: {
 type: itemType,
 item: item
 }
 });

 const style = transform ? {
 transform: CSS.Translate.toString(transform)
 } : undefined;

 return (
 <div
 ref={setNodeRef}
 style={style}
 {...listeners}
 {...attributes}
 className="flex gap-2 p-2 border border-border/50 rounded-md hover:border-primary/50 group cursor-grab active:cursor-grabbing bg-background relative z-10">
 
 <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
 {item.imageUrl ?
 <img
 src={item.imageUrl}
 alt={item.name}
 className="w-full h-full object-cover"
 onError={(event) => {
 event.currentTarget.onerror = null;
 event.currentTarget.src = itemType === 'PLACE' ? '/images/destination-4.jpg' : '/images/hotel-1.jpg';
 }}
 /> :

 <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
 <MapPin className="w-5 h-5 opacity-50" />
 </div>
 }
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
 <h4 className="text-xs font-semibold truncate" title={item.name}>{item.name}</h4>
 <p className="text-[10px] text-muted-foreground font-medium">
 {item.estimatedCost === 0 ? 'Miễn phí' : `${(item.estimatedCost || 0).toLocaleString('vi-VN')} đ`}
 </p>
 </div>
 <GripVertical className="mt-4 h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
 </div>);

};

function AccordionSection({ title, icon, items, itemType, defaultExpanded = false }) {
 const [expanded, setExpanded] = useState(defaultExpanded);

 return (
 <div className="mb-2 overflow-hidden rounded-md border border-border">
 <button
 className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
 onClick={() => setExpanded(!expanded)}>
 
 <div className="flex items-center gap-2 font-medium text-sm text-foreground">
 {icon}
 {title}
 <span className="text-muted-foreground text-xs ml-1">({items.length})</span>
 </div>
 {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
 </button>
 
 {expanded &&
 <div className="p-2 space-y-2 bg-background">
 {items.length === 0 ?
 <div className="text-xs text-muted-foreground p-2 text-center">Không có dữ liệu</div> :

 items.map((item) =>
 <DraggableItem key={item.id} item={item} itemType={itemType} />
 )
 }
 </div>
 }
 </div>);

}

export default function PlannerSidebar() {
 const [keyword, setKeyword] = useState("");
 const scratchpadPlaces = useAppSelector((state) => state.trip.scratchpadPlaces);
 const scratchpadServices = useAppSelector((state) => state.trip.scratchpadServices);

 const placesDict = useAppSelector((state) => state.trip.placesDictionary);
 const servicesDict = useAppSelector((state) => state.trip.servicesDictionary);

 // Map to full Place/Service data for display but keep the TripPlace/TripService for dragging
 const normalizedKeyword = keyword.trim().toLowerCase();
 const matchesKeyword = (item) =>
 !normalizedKeyword || item.name?.toLowerCase().includes(normalizedKeyword);

 const places = scratchpadPlaces.map((tp) => ({
 ...tp,
 ...(placesDict[tp.placeId] || {}),
 estimatedCost: 0
 })).filter(matchesKeyword);

 const services = scratchpadServices.map((ts) => ({
 ...ts,
 ...(servicesDict[ts.serviceId] || {})
 })).filter(matchesKeyword);

 const hotels = services.filter((s) => s.type === 'ACCOMMODATION');
 const restaurants = services.filter((s) => s.type === 'FOOD');
 const activities = services.filter((s) => s.type === 'ACTIVITY');
 const transports = services.filter((s) => s.type === 'TRANSPORT');

 return (
 <div className="h-full flex flex-col space-y-4">
 <div className="space-y-1 mb-2">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 Tài nguyên chuyến đi
 </h3>
 <p className="text-xs text-muted-foreground">Kéo một mục vào ngày phù hợp trong lịch trình.</p>
 </div>

 <div className="relative">
 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input
 type="search"
 aria-label="Tìm kiếm tài nguyên"
 placeholder="Tìm kiếm tài nguyên"
 value={keyword}
 onChange={(event) => setKeyword(event.target.value)}
 className="pl-9 bg-muted/30 border-border h-9 text-sm" />
 
 </div>

 <div className="flex-1 overflow-y-auto pr-1 -mr-1 pb-10">
 
 <AccordionSection
 title="Địa điểm"
 icon={<MapPin className="w-4 h-4 text-primary" />}
 items={places}
 itemType="PLACE"
 defaultExpanded={true} />
 

 <AccordionSection
 title="Chỗ ở"
 icon={<BedDouble className="w-4 h-4 text-indigo-500" />}
 items={hotels}
 itemType="SERVICE" />
 

 <AccordionSection
 title="Ăn uống"
 icon={<Utensils className="w-4 h-4 text-orange-500" />}
 items={restaurants}
 itemType="SERVICE" />
 

 <AccordionSection
 title="Hoạt động"
 icon={<Activity className="w-4 h-4 text-emerald-500" />}
 items={activities}
 itemType="SERVICE" />
 

 <AccordionSection
 title="Di chuyển"
 icon={<Car className="w-4 h-4 text-cyan-500" />}
 items={transports}
 itemType="SERVICE" />
 

 </div>
 </div>);

}
