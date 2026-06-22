import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PUBLIC_ROUTES } from '../../router/routes';
import { HeaderMobileToggle } from './HeaderMobileToggle';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderProfileMenu } from './HeaderProfileMenu';

export function Header({ isMobileOpen, setIsMobileOpen, previewMode = false }) {
  const { role } = useAuth();
  const effectiveRole = previewMode ? 'ADMIN' : role;

  const handleToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <header className="app-header transition-all shrink-0">
      {/* Column 1: Mobile Toggle & Logo (aligned to 280px sidebar on desktop) */}
      <div className="flex shrink-0 items-center gap-2 pr-4 md:w-[248px]">
        <HeaderMobileToggle isMobileOpen={isMobileOpen} onToggle={handleToggle} />
        
        <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-primary transition-opacity hover:opacity-90">
          <div className="flex items-center justify-center rounded-md bg-red-50 p-1.5">
            <Plane className="h-5 w-5 fill-red-100 text-red-500" />
          </div>
          <span className="tracking-tight text-foreground">ezTravel</span>
        </Link>
      </div>

      {/* Desktop Header Area (mathematically centered search bar and right actions, hidden on mobile) */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center flex-1 h-full min-w-0">
        {/* Grid Column 1: Empty left space to balance the right-aligned actions */}
        <div />

        {/* Grid Column 2: Center Search Bar */}
        <div className="flex justify-center px-4">
          {!previewMode && <HeaderSearch />}
        </div>

        {/* Grid Column 3: Right Actions & Profile */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {(effectiveRole === 'PREMIUM' || effectiveRole === 'PREMIUM_TRAVELER') && (
              <div className="px-3 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-full shadow-sm">
                Premium
              </div>
            )}
            {effectiveRole === 'PROVIDER_APPROVED' && (
              <div className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
                Provider
              </div>
            )}
            {effectiveRole === 'ADMIN' && (
              <div className="px-3 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full shadow-sm">
                Admin
              </div>
            )}
          </div>

          {!previewMode && (
            <>
              <HeaderNotifications />
              <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
              <HeaderProfileMenu />
            </>
          )}
        </div>
      </div>

      {/* Mobile Right Actions (only rendered on mobile devices) */}
      <div className="flex md:hidden items-center gap-2 shrink-0">
        {!previewMode && (
          <>
            <HeaderNotifications />
            <HeaderProfileMenu />
          </>
        )}
      </div>
    </header>
  );
}
