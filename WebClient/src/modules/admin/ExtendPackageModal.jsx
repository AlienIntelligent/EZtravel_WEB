import { useState  } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExtendPackageMutation } from "../../store/apis/adminApi";
import { useToast } from "@/components/ui/toast";









export default function ExtendPackageModal({ isOpen, onClose, providerId, providerName, currentEndDate }) {
  const [extendPackage, { isLoading: isExtending }] = useExtendPackageMutation();
  const { toast } = useToast();

  const [newEndDate, setNewEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEndDate) return;

    try {
      const payload = {
        providerId,
        newEndDate: new Date(newEndDate).toISOString()
      };
      await extendPackage(payload).unwrap();
      toast({
        title: "Thành công",
        description: "Đã gia hạn gói cước thành công.",
        variant: "success"
      });
      onClose();
      setNewEndDate("");
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err?.data?.message || "Không thể gia hạn gói cước.",
        variant: "error"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gia Hạn Gói Cước</DialogTitle>
          <DialogDescription>
            Chọn ngày hết hạn mới cho gói cước hiện tại của <strong>{providerName}</strong>.
            {currentEndDate && <span className="block mt-1">Ngày hết hạn hiện tại: {new Date(currentEndDate).toLocaleDateString("vi-VN")}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ngày hết hạn mới</label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newEndDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewEndDate(e.target.value)}
              required />
            
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isExtending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isExtending || !newEndDate}>
              {isExtending ? "Đang xử lý..." : "Xác nhận gia hạn"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}