import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TripBudget({ trip }) {
 if (!trip) return null;

 // Calculate actual sum of all items in timeline
 let totalEstimatedCost = 0;
 const costBreakdown = {
 KhachSan: 0,
 NhaHang: 0,
 HoatDong: 0,
 PhuongTien: 0,
 Khac: 0
 };

 trip.days?.forEach(day => {
 day.items?.forEach(item => {
 const cost = item.chiPhiDuKien || 0;
 totalEstimatedCost += cost;

 if (item.maKhachSan) costBreakdown.KhachSan += cost;
 else if (item.maNhaHang) costBreakdown.NhaHang += cost;
 else if (item.maHoatDong) costBreakdown.HoatDong += cost;
 else if (item.maPhuongTien) costBreakdown.PhuongTien += cost;
 else costBreakdown.Khac += cost;
 });
 });

 const plannedBudget = trip.tongChiPhi || 0;
 const isOverBudget = totalEstimatedCost > plannedBudget && plannedBudget > 0;

 return (
 <div className="space-y-6 animate-fade-in">
 {/* High-level metrics */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <Card>
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Total Planned Budget</CardTitle>
 <Wallet className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">{formatCurrency(plannedBudget)}</div>
 <p className="text-xs text-muted-foreground mt-1">From trip settings</p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Current Estimated Cost</CardTitle>
 <TrendingUp className={`h-4 w-4 ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`} />
 </CardHeader>
 <CardContent>
 <div className={`text-3xl font-bold ${isOverBudget ? 'text-destructive' : 'text-green-600'}`}>
 {formatCurrency(totalEstimatedCost)}
 </div>
 <p className="text-xs text-muted-foreground mt-1">Sum of all scheduled items</p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Remaining / Status</CardTitle>
 <PieChart className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold">
 {plannedBudget > 0 
 ? formatCurrency(Math.abs(plannedBudget - totalEstimatedCost)) 
 : "N/A"}
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 {plannedBudget === 0 
 ? "No planned budget set" 
 : isOverBudget ? "Over budget" : "Under budget"}
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Cost Breakdown */}
 <Card>
 <CardHeader>
 <CardTitle>Category Breakdown</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
 <div className="font-medium">Hotels & Accommodation</div>
 <div className="font-semibold">{formatCurrency(costBreakdown.KhachSan)}</div>
 </div>
 <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
 <div className="font-medium">Food & Dining</div>
 <div className="font-semibold">{formatCurrency(costBreakdown.NhaHang)}</div>
 </div>
 <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
 <div className="font-medium">Activities & Tours</div>
 <div className="font-semibold">{formatCurrency(costBreakdown.HoatDong)}</div>
 </div>
 <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
 <div className="font-medium">Transportation</div>
 <div className="font-semibold">{formatCurrency(costBreakdown.PhuongTien)}</div>
 </div>
 <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
 <div className="font-medium">Other Places / Custom</div>
 <div className="font-semibold">{formatCurrency(costBreakdown.Khac)}</div>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
