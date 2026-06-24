import { useState } from "react";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetAdminPackagesQuery, useAssignPackageMutation } from "../../store/apis/adminApi";
import { useToast } from "@/components/ui/toast";








export default function AssignPackageModal({ isOpen, onClose, providerId, providerName }) {
 const { data: packages, isLoading } = useGetAdminPackagesQuery(undefined, { skip: !isOpen });
 const [assignPackage, { isLoading: isAssigning }] = useAssignPackageMutation();
 const { toast } = useToast();

 const [selectedPackage, setSelectedPackage] = useState("");
 const [durationType, setDurationType] = useState("MONTH");

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!selectedPackage) return;

 try {
 const payload = {
 providerId,
 maGoiNcc: Number(selectedPackage),
 durationType
 };
 await assignPackage(payload).unwrap();
 toast({
 title: "Thành công",
 description: "Đã cấp gói cước cho nhà cung cấp.",
 variant: "success"
 });
 onClose();
 setSelectedPackage("");
 setDurationType("MONTH");
 } catch (err) {
 toast({
 title: "Lỗi",
 description: err?.data?.message || "Không thể cấp gói cước.",
 variant: "error"
 });
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onClose}>
 <DialogContent className="sm:max-w-[425px]">
 <DialogHeader>
 <DialogTitle>Cấp Gói Cước Mới</DialogTitle>
 <DialogDescription>
 Cấp gói cước cho <strong>{providerName}</strong>. Gói cũ (nếu có) sẽ bị hủy.
 </DialogDescription>
 </DialogHeader>
 
 {isLoading ?
 <div className="py-8 flex justify-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 </div> :

 <form onSubmit={handleSubmit} className="space-y-4 py-4">
 <div className="space-y-2">
 <label className="text-sm font-medium">Chọn gói cước</label>
 <select
 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 value={selectedPackage}
 onChange={(e) => setSelectedPackage(Number(e.target.value) || "")}
 required>
 
 <option value="" disabled>-- Chọn gói --</option>
 {packages?.map((pkg) =>
 <option key={pkg.maGoiNcc} value={pkg.maGoiNcc}>
 {pkg.tenGoi}
 </option>
 )}
 </select>
 </div>
 
 <div className="space-y-2">
 <label className="text-sm font-medium">Thời hạn</label>
 <select
 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 value={durationType}
 onChange={(e) => setDurationType(e.target.value)}
 required>
 
 <option value="MONTH">Theo Tháng (MONTH)</option>
 <option value="YEAR">Theo Năm (YEAR)</option>
 </select>
 </div>

 <DialogFooter className="mt-6">
 <Button type="button" variant="outline" onClick={onClose} disabled={isAssigning}>
 Hủy
 </Button>
 <Button type="submit" disabled={isAssigning || !selectedPackage}>
 {isAssigning ? "Đang xử lý..." : "Cấp gói"}
 </Button>
 </DialogFooter>
 </form>
 }
 </DialogContent>
 </Dialog>);

}