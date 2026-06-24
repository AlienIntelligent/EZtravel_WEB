import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";







export default function DestinationDrawer({ isOpen, onClose, destinationName }) {
 if (!isOpen) return null;

 return (
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
 onClick={onClose} />
 
 
 {/* Drawer */}
 <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-background shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-border">
 {/* Header Hero */}
 <div className="relative h-64 shrink-0">
 <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800"
 alt={destinationName}
 className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
 
 <Button
 variant="ghost"
 size="icon"
 className="absolute top-4 right-4 text-white hover:bg-black/20 rounded-full"
 onClick={onClose}>
 
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
 </Button>
 
 <div className="absolute bottom-6 left-6 right-6">
 <h2 className="font-sans text-3xl font-bold text-white mb-2">{destinationName}</h2>
 <div className="flex items-center gap-4 text-white/90 text-sm">
 <span className="flex items-center gap-1">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 4.8 (1,234 Reviews)
 </span>
 <span>120 Hoạt động</span>
 </div>
 </div>
 </div>

 {/* Content Tabs */}
 <div className="flex-1 overflow-y-auto flex flex-col">
 <Tabs defaultValue="overview" className="flex-1 flex flex-col">
 <div className="sticky top-0 bg-background/95 backdrop-blur z-10 px-6 pt-4 border-b border-border">
 <TabsList className="w-full grid grid-cols-4 bg-muted/50 p-1 rounded-xl">
 <TabsTrigger value="overview" className="rounded-lg">Tổng quan</TabsTrigger>
 <TabsTrigger value="hotels" className="rounded-lg">Khách sạn</TabsTrigger>
 <TabsTrigger value="activities" className="rounded-lg">Hoạt động</TabsTrigger>
 <TabsTrigger value="blogs" className="rounded-lg">Bài viết</TabsTrigger>
 </TabsList>
 </div>

 <div className="p-6">
 <TabsContent value="overview" className="space-y-6 mt-0">
 <div>
 <h3 className="text-lg font-semibold mb-2">Về {destinationName}</h3>
 <p className="text-muted-foreground leading-relaxed text-sm">
 Khám phá thành phố biển xinh đẹp với những bãi biển cát trắng trải dài, ẩm thực phong phú và di sản văn hóa độc đáo. Điểm đến lý tưởng cho kỳ nghỉ của bạn với vô số hoạt động giải trí và thư giãn.
 </p>
 </div>
 
 <div>
 <h3 className="text-lg font-semibold mb-3">Thông tin nổi bật</h3>
 <div className="flex flex-wrap gap-2">
 <Badge variant="secondary">Biển đảo</Badge>
 <Badge variant="secondary">Ẩm thực</Badge>
 <Badge variant="secondary">Nghỉ dưỡng</Badge>
 <Badge variant="secondary">Di sản</Badge>
 </div>
 </div>

 <div className="p-4 bg-muted/30 rounded-xl border border-border">
 <h4 className="font-semibold mb-2">Thêm vào lịch trình?</h4>
 <p className="text-sm text-muted-foreground mb-4">Bạn có thể thêm trực tiếp điểm đến này vào lịch trình đang lên của mình.</p>
 <Button className="w-full">Khám phá chi tiết điểm đến</Button>
 </div>
 </TabsContent>

 <TabsContent value="hotels" className="space-y-4 mt-0">
 <p className="text-sm text-muted-foreground mb-4">Danh sách Khách Sạn (KHACH_SAN) tại {destinationName}</p>
 {/* Placeholder Hotel Card */}
 <div className="flex gap-4 p-3 border border-border rounded-xl">
 <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
 <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Hotel" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 </div>
 <div className="flex-1 flex flex-col justify-center">
 <div className="flex justify-between items-start">
 <h4 className="font-semibold">Resort 5 Sao</h4>
 <Badge variant="outline" className="border-primary text-primary">KHACH_SAN</Badge>
 </div>
 <span className="text-xs text-muted-foreground mt-1">Cách trung tâm 2km</span>
 <div className="mt-auto flex justify-between items-end">
 <span className="font-bold text-primary">2,500,000 ₫/đêm</span>
 <Button size="sm" variant="outline">Xem chi tiết</Button>
 </div>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="activities" className="space-y-4 mt-0">
 <p className="text-sm text-muted-foreground mb-4">Danh sách Hoạt động (DIA_DIEM) tại {destinationName}</p>
 {/* Placeholder Activity Card */}
 <div className="flex gap-4 p-3 border border-border rounded-xl">
 <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
 <img src="https://images.unsplash.com/photo-1516483638261-f40af5eba324?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Activity" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 </div>
 <div className="flex-1 flex flex-col justify-center">
 <div className="flex justify-between items-start">
 <h4 className="font-semibold">Tour Đảo Nửa Ngày</h4>
 <Badge variant="outline" className="border-secondary text-secondary">DIA_DIEM</Badge>
 </div>
 <span className="text-xs text-warning mt-1">★ 4.9 (200 đánh giá)</span>
 <div className="mt-auto flex justify-between items-end">
 <span className="font-bold text-primary">500,000 ₫</span>
 <Button size="sm" variant="outline">Thêm vào lịch</Button>
 </div>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="blogs" className="mt-0">
 <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
 <p>Chưa có bài viết (BAI_VIET) nào được chia sẻ về điểm đến này.</p>
 </div>
 </TabsContent>
 </div>
 </Tabs>
 </div>
 </div>
 </>);

}