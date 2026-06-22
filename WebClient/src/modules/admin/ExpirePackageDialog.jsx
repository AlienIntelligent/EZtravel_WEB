
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExpirePackageMutation } from "../../store/apis/adminApi";
import { useToast } from "@/components/ui/toast";








export default function ExpirePackageDialog({ isOpen, onClose, providerId, providerName }) {
  const [expirePackage, { isLoading: isExpiring }] = useExpirePackageMutation();
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      const payload = {
        providerId
      };
      await expirePackage(payload).unwrap();
      toast({
        title: "Thành công",
        description: "Gói cước đã được chuyển sang trạng thái hết hạn.",
        variant: "success"
      });
      onClose();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err?.data?.message || "Không thể hủy gói cước.",
        variant: "error"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-rose-600">Xác Nhận Hủy/Hết Hạn Gói Cước</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy gói cước hiện tại của <strong>{providerName}</strong> không? Hành động này sẽ cập nhật trạng thái gói thành EXPIRED và không thể hoàn tác, trừ khi bạn cấp gói mới.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isExpiring}>
            Hủy bỏ
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isExpiring}>
            {isExpiring ? "Đang xử lý..." : "Xác nhận Hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}