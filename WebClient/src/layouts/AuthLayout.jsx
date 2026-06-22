import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Branding Panel - 40% (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex w-[40%] bg-slate-950 flex-col justify-between p-12 text-white relative overflow-hidden border-r border-border">
        {/* Modern Glowing Backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_45%)]" />

        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-sans text-lg font-extrabold shadow-md shadow-primary/20">EZ</span>
            <span>Travel</span>
          </Link>
          
          <div className="mt-20 space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white font-sans">
              Khám phá Việt Nam<br />
              <span className="text-primary font-serif italic font-normal">theo cách của bạn</span>
            </h1>
            <p className="text-base text-slate-400 max-w-sm leading-relaxed">
              Thiết kế, tối ưu và chia sẻ hành trình du lịch tự túc hoàn hảo cùng sự hỗ trợ của công nghệ thông minh.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200 font-semibold text-sm">✓ 10.000+ lịch trình tự túc</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200 font-semibold text-sm">✓ 2.000+ địa điểm được đánh giá</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-200 font-semibold text-sm">✓ Cộng đồng du lịch sôi động</span>
            </div>
          </div>
        </div>

        {/* Mini Footer for Desktop */}
        <div className="text-xs text-slate-500 relative z-10 flex gap-4 items-center">
          <span>&copy; {new Date().getFullYear()} EZTravel</span>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">Hỗ trợ</a>
        </div>
      </div>
      
      {/* Right Authentication Panel - 60% */}
      <div className="relative flex flex-1 flex-col items-center justify-between overflow-y-auto p-6 sm:p-8 lg:p-12">
        {/* Mobile Header */}
        <div className="w-full flex justify-between items-center mb-8 lg:mb-0">
          <Link to="/" className="font-serif text-2xl font-bold text-primary flex items-center gap-2 lg:hidden">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-sans text-base font-extrabold">EZ</span>
            <span className="text-foreground">Travel</span>
          </Link>
        </div>
        
        {/* Center Container */}
        <div className="w-full max-w-[460px] my-auto">
          <Outlet />
        </div>

        {/* Mini Footer for Mobile/Tablet */}
        <div className="mt-8 flex gap-4 text-xs text-muted-foreground justify-center lg:hidden">
          <a href="#" className="hover:underline">Điều khoản</a>
          <span>&bull;</span>
          <a href="#" className="hover:underline">Chính sách</a>
          <span>&bull;</span>
          <a href="#" className="hover:underline">Hỗ trợ</a>
        </div>
        
        <div className="hidden lg:block h-2" />
      </div>
    </div>
  );
}
