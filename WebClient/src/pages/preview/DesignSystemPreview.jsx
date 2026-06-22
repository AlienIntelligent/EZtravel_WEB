import { useState } from 'react';
import { Sidebar } from '../../components/navigation/Sidebar';
import { Header } from '../../components/header/Header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { 
  Plane, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Lock, 
  X, 
  CheckCircle2, 
  Loader2, 
  FolderOpen,
  MoreVertical
} from 'lucide-react';

export default function DesignSystemPreview() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  
  // Interactive Showcase States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [radioVal, setRadioVal] = useState('option-a');
  const [switchVal, setSwitchVal] = useState(true);
  const [selectVal, setSelectVal] = useState('danang');

  return (
    <div className="app-shell flex flex-col h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} previewMode={true} />

      <div className="shell-body flex flex-1 overflow-hidden relative">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} previewMode={true} />

        <main className="content-area flex-1 overflow-y-auto bg-slate-50 relative z-0 p-6">
          <div className="max-w-[1600px] mx-auto w-full space-y-12 pb-16">
            
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Design System & Component Showcase</h1>
                <p className="text-slate-500 mt-2 max-w-3xl text-sm leading-relaxed">
                  Trang kiểm thử trực quan hóa các thành phần giao diện (UI components) dùng chung, đảm bảo tính nhất quán trên hệ thống ezTravel.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-sky-500 hover:bg-sky-600 text-white cursor-pointer font-semibold text-xs py-2 h-9 rounded-lg"
                >
                  Mở Modal Thử Nghiệm
                </Button>
                <Button 
                  onClick={() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50 text-xs py-2 h-9 rounded-lg cursor-pointer"
                >
                  Kích hoạt Toast
                </Button>
              </div>
            </div>

            {/* 1. Typography */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">1. Typography (Kiểu chữ)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Heading 1 (Serif)</span>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">EZTravel. Khám phá Việt Nam</h1>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Heading 2 (Serif)</span>
                    <h2 className="text-xl font-serif font-bold text-slate-800">Lộ Trình Tự Túc Cho Riêng Bạn</h2>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Heading 3 (Sans)</span>
                    <h3 className="text-base font-semibold text-slate-800">Thống kê hoạt động hôm nay</h3>
                  </div>
                </div>
                <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Body Text (Regular)</span>
                    <p>Khám phá Việt Nam theo cách của bạn. Lộ trình chi tiết, dịch vụ chất lượng và trải nghiệm tuyệt vời. Ứng dụng lập kế hoạch thông minh giúp chuyến đi trọn vẹn.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Muted Text</span>
                    <p className="text-slate-400 text-xs">Cập nhật lần cuối: 15:45, ngày 13 tháng 6 năm 2026</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Colors */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">2. Color Palette (Bảng màu)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div className="space-y-1.5">
                  <div className="h-12 bg-sky-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Primary Ocean</p>
                  <p className="text-[10px] text-slate-400 font-mono">#0EA5E9</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 bg-teal-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Secondary Teal</p>
                  <p className="text-[10px] text-slate-400 font-mono">#14B8A6</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 bg-amber-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Premium Gold</p>
                  <p className="text-[10px] text-slate-400 font-mono">#F59E0B</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 bg-emerald-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Success Green</p>
                  <p className="text-[10px] text-slate-400 font-mono">#10B981</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 bg-orange-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Warning Orange</p>
                  <p className="text-[10px] text-slate-400 font-mono">#F97316</p>
                </div>
                <div className="space-y-1.5">
                  <div className="h-12 bg-red-500 rounded-xl shadow-sm"></div>
                  <p className="text-xs font-bold text-slate-800">Destructive Red</p>
                  <p className="text-[10px] text-slate-400 font-mono">#EF4444</p>
                </div>
              </div>
            </section>

            {/* 3. Buttons & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">3. Buttons (Nút bấm)</h2>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white cursor-pointer rounded-xl">Primary Ocean</Button>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white cursor-pointer rounded-xl">Secondary Teal</Button>
                  <Button variant="outline" className="cursor-pointer border-slate-200 hover:bg-slate-50 rounded-xl">Outline</Button>
                  <Button variant="ghost" className="cursor-pointer hover:bg-slate-100 rounded-xl">Ghost</Button>
                  <Button className="bg-sky-500 text-white rounded-xl" disabled>Disabled</Button>
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">4. Badges (Huy hiệu & Nhãn)</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center justify-center px-3 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-full shadow-sm">
                    Premium Gold
                  </span>
                  <span className="flex items-center justify-center px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
                    Provider Blue
                  </span>
                  <span className="flex items-center justify-center px-3 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full shadow-sm">
                    Admin Red
                  </span>
                  <span className="flex items-center justify-center px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-full">
                    Sắp có
                  </span>
                </div>
              </section>
            </div>

            {/* 4. Form Controls & Inputs */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">5. Form Controls & Inputs (Trường biểu mẫu)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Standard Inputs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trường Nhập Liệu</h3>
                  <div>
                    <Label htmlFor="inp-email" className="text-slate-700 text-xs font-semibold">Địa chỉ Email</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input id="inp-email" placeholder="email@example.com" className="pl-10 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="inp-lock" className="text-slate-700 text-xs font-semibold">Mật khẩu khóa</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input id="inp-lock" type="password" value="12345678" disabled className="pl-10 rounded-xl bg-slate-50" />
                    </div>
                  </div>
                </div>

                {/* Dropdowns / Select & Textarea */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dropdown & Textarea</h3>
                  <div>
                    <Label className="text-slate-700 text-xs font-semibold">Điểm đến yêu thích</Label>
                    <select 
                      value={selectVal} 
                      onChange={(e) => setSelectVal(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    >
                      <option value="danang">Đà Nẵng</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="dalat">Đà Lạt</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-slate-700 text-xs font-semibold">Ghi chú hành trình</Label>
                    <textarea 
                      placeholder="Nhập ghi chú chi tiết cho hành trình của bạn..." 
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                    />
                  </div>
                </div>

                {/* Checkbox, Radio, Switch */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Checkbox, Radio, Switch</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showcase-check" 
                        checked={checkboxVal} 
                        onChange={(e) => setCheckboxVal(e.target.checked)} 
                        className="cursor-pointer"
                      />
                      <Label htmlFor="showcase-check" className="text-sm cursor-pointer select-none">Tôi đồng ý điều khoản dịch vụ</Label>
                    </div>

                    <div className="h-px bg-slate-100 my-2"></div>

                    {/* Radio Options */}
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-400 font-semibold block uppercase">Hình thức đi du lịch</Label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="radio-group" 
                            value="option-a" 
                            checked={radioVal === 'option-a'} 
                            onChange={() => setRadioVal('option-a')}
                            className="text-sky-500 focus:ring-sky-500" 
                          />
                          Tự túc
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="radio-group" 
                            value="option-b" 
                            checked={radioVal === 'option-b'} 
                            onChange={() => setRadioVal('option-b')}
                            className="text-sky-500 focus:ring-sky-500" 
                          />
                          Theo Tour
                        </label>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-2"></div>

                    {/* Custom Switch Component */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showcase-switch" className="text-sm cursor-pointer select-none">Bật chế độ thông báo AI</Label>
                      <button 
                        id="showcase-switch"
                        onClick={() => setSwitchVal(!switchVal)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                          switchVal ? 'bg-sky-500' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          switchVal ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 6. Data Tables */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">6. Data Tables (Bảng dữ liệu mẫu)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                      <th className="py-3 px-4">Thành viên</th>
                      <th className="py-3 px-4">Quyền hạn</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
                          ND
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">Nguyễn Văn Dũng</span>
                          <span className="text-xs text-slate-400">dungnv@eztravel.com</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">Traveler</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600">
                          Hoạt động
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                          TM
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">Trần Thị Mai</span>
                          <span className="text-xs text-slate-400">maitt@eztravel.com</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">Provider</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-500">
                          Chờ duyệt
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Loading & Empty States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Loading States */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">7. Loading States (Trạng thái tải)</h2>
                <div className="space-y-4">
                  {/* Inline Spinner */}
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                    <span>Đang đồng bộ lịch trình của bạn với máy chủ...</span>
                  </div>

                  {/* Skeleton Loading Card */}
                  <div className="border border-slate-100 rounded-xl p-4 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </section>

              {/* Empty States */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">8. Empty States (Bố cục trang trống)</h2>
                <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800 text-sm">Chưa có lịch trình nào được lưu</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Hãy bắt đầu bằng việc lập kế hoạch cho chuyến đi mơ ước tiếp theo của bạn cùng EZTravel.
                    </p>
                  </div>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-1.5 h-8 cursor-pointer rounded-lg">
                    Tạo Chuyến Đi
                  </Button>
                </div>
              </section>

            </div>

            {/* 8. Cards & Surfaces */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-slate-950 border-b pb-2">9. Cards & Surfaces (Khối hộp thẻ)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Standard Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-24 bg-slate-100 flex items-center justify-center border-b">
                    <Plane className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">Standard White Card</h3>
                    <p className="text-xs text-slate-500 leading-normal">Thẻ nền trắng chuẩn với đường viền mỏng và bóng đổ nhẹ.</p>
                  </div>
                </div>

                {/* KPI Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-sky-50 p-3 rounded-xl flex items-center justify-center text-sky-500">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lượt tiếp cận</p>
                    <h4 className="text-xl font-serif font-bold text-slate-800 mt-0.5">14,200</h4>
                  </div>
                </div>

                {/* Status Indicator Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bảo mật</p>
                    <h4 className="text-xs font-bold text-emerald-600 mt-1.5 bg-emerald-50 px-2 py-0.5 rounded">Đã kiểm chứng an toàn</h4>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* --- MOCK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-serif font-bold text-slate-900">Thông tin lịch trình mẫu</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>Đây là hộp thoại (Modal Dialog) minh họa phục vụ kiểm thử hệ thống thiết kế ezTravel.</p>
              <div className="p-3 bg-sky-50 rounded-xl text-sky-700 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs">Lịch trình tự động được lưu trữ đám mây, cho phép làm việc cộng tác thời gian thực.</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2">
              <Button 
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="text-xs py-1.5 h-8 border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Đóng lại
              </Button>
              <Button 
                onClick={() => {
                  setIsModalOpen(false);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white text-xs py-1.5 h-8 font-semibold cursor-pointer rounded-lg"
              >
                Lưu Thay Đổi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOCK TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[300] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">
            Đã đồng bộ hóa dữ liệu thành công!
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white ml-2 rounded-lg p-0.5 hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
