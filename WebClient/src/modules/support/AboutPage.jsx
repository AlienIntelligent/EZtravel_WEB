import React from 'react';
import PageHero from "@/shared/components/PageHero";

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageHero
        title="Về chúng tôi"
        description="ezTravel - Hành trình của bạn, đam mê của chúng tôi"
        bgImage="/images/bg_1.jpg"
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-slate max-w-none text-muted-foreground">
        <p className="mb-4">
          Chào mừng bạn đến với ezTravel - nền tảng du lịch thông minh và toàn diện nhất dành cho người Việt.
        </p>
        <p className="mb-4">
          Sứ mệnh của chúng tôi là kết nối du khách với những trải nghiệm tuyệt vời nhất, từ việc tìm kiếm địa điểm, 
          lên kế hoạch lịch trình bằng AI, cho đến việc đặt các dịch vụ lưu trú, nhà hàng và hoạt động du lịch với 
          các đối tác uy tín.
        </p>
        <p className="mb-4">
          Được thành lập với mong muốn đơn giản hóa việc đi du lịch, ezTravel cung cấp một hệ sinh thái đầy đủ 
          giúp bạn không còn phải đau đầu tìm kiếm thông tin phân mảnh trên internet. Tất cả đều có sẵn, 
          trực quan và dễ dàng.
        </p>
        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Liên hệ</h2>
        <ul className="list-disc pl-5">
          <li>Địa chỉ: Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</li>
          <li>Email: info@eztravel.com</li>
          <li>Hotline: +84 123 456 789</li>
        </ul>
      </div>
      </div>
    </div>
  );
}
