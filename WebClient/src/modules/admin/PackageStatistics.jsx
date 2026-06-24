
import { Users, CheckCircle, XCircle, Shield, Award, Crown } from "lucide-react";





export default function PackageStatistics({ stats }) {
 const cards = [
 {
 title: "Tổng Nhà Cung Cấp",
 value: stats.totalProviders,
 icon: Users,
 color: "text-blue-600",
 bg: "bg-blue-100 dark:bg-blue-900/30"
 },
 {
 title: "Gói Đang Hoạt Động",
 value: stats.activePackages,
 icon: CheckCircle,
 color: "text-emerald-600",
 bg: "bg-emerald-100 dark:bg-emerald-900/30"
 },
 {
 title: "Gói Hết Hạn",
 value: stats.expiredPackages,
 icon: XCircle,
 color: "text-rose-600",
 bg: "bg-rose-100 dark:bg-rose-900/30"
 },
 {
 title: "Miễn Phí (Free)",
 value: stats.freeProviders,
 icon: Shield,
 color: "text-muted-foreground",
 bg: "bg-muted "
 },
 {
 title: "Tiêu Chuẩn (Standard)",
 value: stats.standardProviders,
 icon: Award,
 color: "text-amber-600",
 bg: "bg-amber-100 dark:bg-amber-900/30"
 },
 {
 title: "Cao Cấp (Premium)",
 value: stats.premiumProviders,
 icon: Crown,
 color: "text-violet-600",
 bg: "bg-violet-100 dark:bg-violet-900/30"
 }];


 return (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
 {cards.map((card, index) => {
 const Icon = card.icon;
 return (
 <div
 key={index}
 className="bg-background rounded-xl p-4 border border-border flex items-center gap-4">
 
 <div className={`p-3 rounded-full shrink-0 ${card.bg} ${card.color}`}>
 <Icon className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
 {card.title}
 </p>
 <h4 className="text-2xl font-bold text-foreground mt-1">
 {card.value}
 </h4>
 </div>
 </div>);

 })}
 </div>);

}