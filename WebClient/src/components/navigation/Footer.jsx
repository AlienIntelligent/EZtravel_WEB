import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { PUBLIC_ROUTES } from '../../router/routes';

export function Footer() {
  return (
    <footer className="w-full bg-white text-slate-600 py-6 border-t border-slate-200 flex-shrink-0 z-30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-sky-600 transition-opacity hover:opacity-90">
              <div className="bg-sky-50 p-1.5 rounded-lg flex items-center justify-center">
                <Plane className="h-5 w-5 text-sky-600 fill-sky-600/10" />
              </div>
              <span className="tracking-tight text-slate-800">ezTravel</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khám phá Việt Nam theo cách của bạn. Lộ trình chi tiết, dịch vụ chất lượng và trải nghiệm tuyệt vời.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={PUBLIC_ROUTES.EXPLORE} className="hover:text-sky-600 transition-colors focus:outline-none">
                  Điểm đến
                </Link>
              </li>
              <li>
                <Link to={PUBLIC_ROUTES.COMMUNITY} className="hover:text-sky-600 transition-colors focus:outline-none">
                  Cộng đồng
                </Link>
              </li>
              <li>
                <Link to={PUBLIC_ROUTES.BLOGS} className="hover:text-sky-600 transition-colors focus:outline-none">
                  Kinh nghiệm
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">Hỗ trợ</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-sky-600 transition-colors focus:outline-none">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-sky-600 transition-colors focus:outline-none">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-sky-600 transition-colors focus:outline-none">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@eztravel.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} ezTravel. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
