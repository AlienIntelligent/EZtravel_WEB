import React from 'react';
import PageHero from "@/shared/components/PageHero";

export default function TermsPage() {
  return (
    <div className="w-full">
      <PageHero
        title="Điều khoản dịch vụ"
        description="Các quy định và thỏa thuận sử dụng dịch vụ trên hệ thống ezTravel"
        bgImage="/images/bg_1.jpg"
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-slate max-w-none text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">1. Chấp nhận điều khoản</h2>
        <p className="mb-4">
          Bằng việc sử dụng nền tảng ezTravel, bạn đồng ý tuân thủ các Điều khoản dịch vụ này. Nếu bạn không đồng ý với 
          bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">2. Đăng ký tài khoản</h2>
        <p className="mb-4">
          Bạn cần cung cấp thông tin chính xác và đầy đủ khi tạo tài khoản. Bạn có trách nhiệm bảo mật thông tin đăng nhập 
          và chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">3. Đối tác cung cấp dịch vụ</h2>
        <p className="mb-4">
          Các Nhà cung cấp dịch vụ phải tuân thủ nghiêm ngặt các quy định về chất lượng và độ chính xác của thông tin 
          đăng tải. ezTravel có quyền gỡ bỏ các dịch vụ vi phạm tiêu chuẩn cộng đồng mà không cần báo trước.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">4. Quyền sở hữu trí tuệ</h2>
        <p className="mb-4">
          Tất cả nội dung, thương hiệu, mã nguồn trên hệ thống đều thuộc quyền sở hữu của ezTravel. Nghiêm cấm sao chép, 
          phân phối hoặc sử dụng cho mục đích thương mại khi chưa có sự cho phép.
        </p>

        <p className="mt-8 text-sm italic">Cập nhật lần cuối: Tháng 6, 2026</p>
      </div>
      </div>
    </div>
  );
}
