import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailVerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="w-full text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
          <div className="relative bg-success/10 p-4 rounded-full">
            <CheckCircle className="w-[64px] h-[64px] text-success" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-heading mb-4">
        Xác thực thành công!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Tài khoản của bạn đã được kích hoạt. Chào mừng bạn đến với EZTravel! Bạn đã có thể bắt đầu lên kế hoạch cho những chuyến đi tuyệt vời.
      </p>

      <Button
        onClick={() => navigate('/dashboard')}
        className="h-12 px-8 text-base font-semibold">
        
        Đi đến Bảng điều khiển
      </Button>
    </div>);

}