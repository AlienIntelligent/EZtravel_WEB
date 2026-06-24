import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PartnerBadge } from "@/components/ui/PartnerBadge";
import { useToast } from "@/components/ui/toast";

export default function DesignSystemShowcase() {
 const { toast } = useToast();
 const [isDialogOpen, setIsDialogOpen] = useState(false);

 return (
 <div className="p-8 max-w-7xl mx-auto space-y-16">
 <header className="mb-12 border-b pb-6">
 <h1 className="text-4xl font-sans font-bold text-foreground mb-2">
 EZTravel Design System v2.0
 </h1>
 <p className="text-muted-foreground text-lg">
 Official pre-implementation visual showcase and validation page.
 </p>
 </header>

 {/* 1. Typography */}
 <section className="space-y-6">
 <h2 className="text-2xl font-sans font-semibold text-foreground border-b pb-2">
 1. Typography Scale
 </h2>
 <div className="space-y-6 bg-background p-6 rounded-xl border border-border ">
 <div>
 <span className="text-xs text-muted-foreground block mb-1">Display (Poppins Bold 48px / 3rem)</span>
 <span className="text-5xl font-sans font-bold tracking-tight">Display Headline</span>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">H1 (Poppins Bold 36px / 2.25rem)</span>
 <h1 className="text-4xl font-sans font-bold">Heading 1</h1>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">H2 (Poppins SemiBold 30px / 1.875rem)</span>
 <h2 className="text-3xl font-sans font-semibold">Heading 2</h2>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">H3 (Poppins SemiBold 24px / 1.5rem)</span>
 <h3 className="text-2xl font-sans font-semibold">Heading 3</h3>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">H4 (Poppins SemiBold 20px / 1.25rem)</span>
 <h4 className="text-xl font-sans font-semibold">Heading 4</h4>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">Body Large (Inter Regular 18px / 1.125rem)</span>
 <p className="text-lg">This is large body copy used for lead paragraphs and instructions.</p>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">Body (Inter Regular 16px / 1.0rem)</span>
 <p className="text-base">This is standard body copy used for descriptions, forms, and general content reading.</p>
 </div>
 <div>
 <span className="text-xs text-muted-foreground block mb-1">Caption (Inter Medium 12px / 0.75rem)</span>
 <p className="text-xs font-medium text-muted-foreground">This is caption text used for dates, metadata, and helper text labels.</p>
 </div>
 </div>
 </section>

 {/* 2. Color System */}
 <section className="space-y-6">
 <h2 className="text-2xl font-sans font-semibold text-foreground border-b pb-2">
 2. Color System
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-4 rounded-lg bg-[#0EA5E9] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Primary</span>
 <span className="text-xs">#0EA5E9 (Ocean Blue)</span>
 </div>
 <div className="p-4 rounded-lg bg-[#14B8A6] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Secondary</span>
 <span className="text-xs">#14B8A6 (Teal)</span>
 </div>
 <div className="p-4 rounded-lg bg-[#F59E0B] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Accent</span>
 <span className="text-xs">#F59E0B (Amber)</span>
 </div>
 <div className="p-4 rounded-lg bg-[#D4AF37] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Premium</span>
 <span className="text-xs">#D4AF37 (Gold)</span>
 </div>
 <div className="p-4 rounded-lg bg-[#22C55E] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Success</span>
 <span className="text-xs">#22C55E</span>
 </div>
 <div className="p-4 rounded-lg bg-[#F97316] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Warning</span>
 <span className="text-xs">#F97316</span>
 </div>
 <div className="p-4 rounded-lg bg-[#EF4444] text-white flex flex-col justify-between h-24 shadow">
 <span className="font-semibold">Danger</span>
 <span className="text-xs">#EF4444</span>
 </div>
 </div>

 <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Map Tokens</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <div className="p-4 rounded-lg bg-[#3B82F6] text-white flex flex-col justify-between h-20 shadow">
 <span className="text-sm font-semibold">Route Line</span>
 <span className="text-xs">#3B82F6</span>
 </div>
 <div className="p-4 rounded-lg bg-[#2563EB] text-white flex flex-col justify-between h-20 shadow">
 <span className="text-sm font-semibold">Active Route</span>
 <span className="text-xs">#2563EB</span>
 </div>
 <div className="p-4 rounded-lg bg-[#14B8A6] text-white flex flex-col justify-between h-20 shadow">
 <span className="text-sm font-semibold">Map Stop Pin</span>
 <span className="text-xs">#14B8A6</span>
 </div>
 <div className="p-4 rounded-lg bg-[#F59E0B] text-white flex flex-col justify-between h-20 shadow">
 <span className="text-sm font-semibold">Selected Pin</span>
 <span className="text-xs">#F59E0B</span>
 </div>
 </div>
 </section>

 {/* 3. Partner Badge System */}
 <section className="space-y-6">
 <h2 className="text-2xl font-sans font-semibold text-foreground border-b pb-2">
 3. Partner Badge System
 </h2>
 <div className="flex flex-wrap gap-4 p-6 bg-background rounded-xl border border-border ">
 <PartnerBadge type="VERIFIED_PARTNER" />
 <PartnerBadge type="PREMIUM_PARTNER" />
 <PartnerBadge type="FEATURED" />
 <PartnerBadge type="TRENDING" />
 </div>
 </section>

 {/* 4. Component Showcase */}
 <section className="space-y-6">
 <h2 className="text-2xl font-sans font-semibold text-foreground border-b pb-2">
 4. Shared Component Library
 </h2>

 {/* Buttons */}
 <div className="space-y-4 bg-background p-6 rounded-xl border border-border ">
 <h3 className="text-lg font-semibold mb-2">Buttons</h3>
 <div className="flex flex-wrap gap-4">
 <Button variant="default">Primary Button</Button>
 <Button variant="secondary">Secondary Button</Button>
 <Button variant="outline">Outline Button</Button>
 <Button variant="ghost">Ghost Button</Button>
 <Button variant="link">Link Button</Button>
 <Button disabled>Disabled Button</Button>
 </div>
 </div>

 {/* Inputs & Form Elements */}
 <div className="space-y-4 bg-background p-6 rounded-xl border border-border ">
 <h3 className="text-lg font-semibold mb-2">Form Controls</h3>
 <div className="grid md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-medium text-muted-foreground ">Text Input</label>
 <Input type="text" placeholder="Nhập văn bản..." />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-muted-foreground ">Select Choice</label>
 <Select defaultValue="val1">
 <SelectTrigger>
 <SelectValue placeholder="Chọn gói..." />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="val1">Gói PREMIUM</SelectItem>
 <SelectItem value="val2">Gói STANDARD</SelectItem>
 <SelectItem value="val3">Gói FREE</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium text-muted-foreground ">Textarea Comments</label>
 <Textarea placeholder="Để lại ý kiến..." rows={3} />
 </div>
 </div>
 </div>

 {/* Cards */}
 <div className="space-y-4 bg-background p-6 rounded-xl border border-border ">
 <h3 className="text-lg font-semibold mb-2">Cards</h3>
 <div className="grid md:grid-cols-2 gap-6">
 <Card>
 <CardHeader>
 <CardTitle>Hanoi Luxury Hotel</CardTitle>
 <CardDescription>Khách sạn 5 sao chất lượng cao</CardDescription>
 </CardHeader>
 <CardContent>
 <p className="text-sm text-muted-foreground ">
 Dịch vụ phòng đầy đủ, bao gồm buffet sáng và hỗ trợ check-in sớm.
 </p>
 </CardContent>
 <CardFooter className="flex justify-between items-center">
 <PartnerBadge type="PREMIUM_PARTNER" />
 <Button size="sm">Xem chi tiết</Button>
 </CardFooter>
 </Card>

 <Card className="border-amber-300 shadow-amber-100 dark:shadow-none">
 <CardHeader>
 <div className="flex justify-between items-start">
 <div>
 <CardTitle>Ha Long Cruise Tour</CardTitle>
 <CardDescription>Du thuyền cao cấp 2 ngày 1 đêm</CardDescription>
 </div>
 <PartnerBadge type="FEATURED" showText={false} />
 </div>
 </CardHeader>
 <CardContent>
 <p className="text-sm text-muted-foreground ">
 Trải nghiệm ngắm hoàng hôn tuyệt đẹp trên Vịnh Hạ Long.
 </p>
 </CardContent>
 <CardFooter className="flex justify-between items-center">
 <span className="text-lg font-bold text-amber-600">2,500,000đ</span>
 <Button variant="secondary" size="sm">Đặt ngay</Button>
 </CardFooter>
 </Card>
 </div>
 </div>

 {/* Dialog & Overlays */}
 <div className="space-y-4 bg-background p-6 rounded-xl border border-border ">
 <h3 className="text-lg font-semibold mb-2">Modals & Notifications</h3>
 <div className="flex flex-wrap gap-4">
 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
 <DialogTrigger asChild>
 <Button variant="outline">Mở Dialog Modal</Button>
 </DialogTrigger>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Xác nhận Đăng ký</DialogTitle>
 <DialogDescription>
 Bạn có chắc chắn muốn đăng ký gói cước PREMIUM để nâng tầm thương hiệu?
 </DialogDescription>
 </DialogHeader>
 <DialogFooter>
 <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
 Hủy
 </Button>
 <Button onClick={() => setIsDialogOpen(false)}>Xác nhận</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <Button
 variant="outline"
 onClick={() =>
 toast({
 title: "Thông báo thành công",
 description: "Bạn đã đăng ký gói cước thành công!",
 variant: "success"
 })
 }>
 
 Toast Success
 </Button>
 <Button
 variant="outline"
 onClick={() =>
 toast({
 title: "Lỗi hệ thống",
 description: "Không thể kết nối tới máy chủ.",
 variant: "destructive"
 })
 }>
 
 Toast Error
 </Button>
 </div>
 </div>

 {/* Tabs, Avatars, Skeletons */}
 <div className="space-y-4 bg-background p-6 rounded-xl border border-border ">
 <h3 className="text-lg font-semibold mb-2">Navigation & Placeholders</h3>
 <div className="grid md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <span className="text-sm font-medium block text-muted-foreground">Tabs Control</span>
 <Tabs defaultValue="tab1">
 <TabsList>
 <TabsTrigger value="tab1">Thông tin</TabsTrigger>
 <TabsTrigger value="tab2">Lịch trình</TabsTrigger>
 <TabsTrigger value="tab3">Đánh giá</TabsTrigger>
 </TabsList>
 <TabsContent value="tab1" className="p-4 border rounded-md mt-2 text-sm">
 Tab Content: Thông tin chi tiết dịch vụ.
 </TabsContent>
 <TabsContent value="tab2" className="p-4 border rounded-md mt-2 text-sm">
 Tab Content: Lịch trình du lịch.
 </TabsContent>
 <TabsContent value="tab3" className="p-4 border rounded-md mt-2 text-sm">
 Tab Content: Review ý kiến khách hàng.
 </TabsContent>
 </Tabs>
 </div>

 <div className="space-y-4">
 <span className="text-sm font-medium block text-muted-foreground">Avatar & Skeleton Loading</span>
 <div className="flex items-center gap-4">
 <Avatar>
 <AvatarFallback className="bg-slate-200 text-foreground">AM</AvatarFallback>
 </Avatar>
 <div className="space-y-2 flex-1">
 <Skeleton className="h-4 w-1/3" />
 <Skeleton className="h-3 w-1/2" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 </div>);

}