import React from 'react';
import PageHero from "@/shared/components/PageHero";

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <PageHero
        title="Chính sách bảo mật"
        description="Bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn là ưu tiên hàng đầu"
        bgImage="/images/bg_1.jpg"
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-slate max-w-none text-muted-foreground">
        <p className="mb-4">
          Sự riêng tư của bạn là ưu tiên hàng đầu tại ezTravel. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn 
          bằng các biện pháp bảo mật tiên tiến nhất.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">1. Thu thập thông tin</h2>
        <p className="mb-4">
          Chúng tôi chỉ thu thập các thông tin cần thiết như tên, email, số điện thoại để hỗ trợ bạn trong việc 
          đặt dịch vụ và cá nhân hóa trải nghiệm lịch trình du lịch.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">2. Sử dụng thông tin</h2>
        <p className="mb-4">
          Thông tin của bạn được sử dụng để:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Cung cấp và duy trì dịch vụ.</li>
          <li>Thông báo về các thay đổi, xác nhận thanh toán.</li>
          <li>Đề xuất lịch trình thông minh thông qua AI.</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-6 mb-4">3. Chia sẻ thông tin với bên thứ 3</h2>
        <p className="mb-4">
          Chúng tôi chỉ chia sẻ thông tin cần thiết (như tên và thông tin liên hệ cơ bản) với Nhà cung cấp khi bạn 
          thực hiện đặt dịch vụ thành công để họ có thể đón tiếp bạn. Tuyệt đối không bán dữ liệu cho bên thứ ba.
        </p>

        <p className="mt-8 text-sm italic">Cập nhật lần cuối: Tháng 6, 2026</p>
      </div>
      </div>
    </div>
  );
}
