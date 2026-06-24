import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PUBLIC_ROUTES } from '../../router/routes';
import { HeaderMobileToggle } from './HeaderMobileToggle';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderProfileMenu } from './HeaderProfileMenu';
import { ThemeToggle } from './ThemeToggle';

export function Header({ isMobileOpen, setIsMobileOpen, previewMode = false }) {
 const { role } = useAuth();
 const effectiveRole = previewMode ? 'ADMIN' : role;

 const handleToggle = () => {
 setIsMobileOpen(!isMobileOpen);
 };

 return (
 <header className="app-header bg-background border-b border-border transition-all shrink-0">
 {/* Column 1: Mobile Toggle & Logo (aligned to 280px sidebar on desktop) */}
 <div className="flex shrink-0 items-center gap-2 pr-4 md:w-[248px]">
 <HeaderMobileToggle isMobileOpen={isMobileOpen} onToggle={handleToggle} />
 
 <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 font-sans font-bold text-2xl text-foreground transition-opacity hover:opacity-90">
 <div className="flex items-center justify-center rounded-md bg-cta/10 p-1.5 shadow-sm">
 <Plane className="h-6 w-6 fill-cta/30 text-cta" />
 </div>
 <span className="tracking-tight text-foreground drop-shadow-sm">ezTravel</span>
 </Link>
 </div>

 {/* Desktop Header Area (mathematically centered search bar and right actions, hidden on mobile) */}
 <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center flex-1 h-full min-w-0">
 {/* Grid Column 1: Empty left space to balance the right-aligned actions */}
 <div />

 {/* Grid Column 2: Center */}
 <div className="flex justify-center px-4">
 </div>

 {/* Grid Column 3: Right Actions & Profile */}
 <div className="flex items-center justify-end gap-2 sm:gap-3">
 <div className="flex items-center gap-2">
 {(effectiveRole === 'PREMIUM' || effectiveRole === 'PREMIUM_TRAVELER') && (
 <div className="px-3 py-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-sm">
 Premium
 </div>
 )}
 {effectiveRole === 'PROVIDER_APPROVED' && (
 <div className="px-3 py-1 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full shadow-sm">
 Provider
 </div>
 )}
 {effectiveRole === 'ADMIN' && (
 <div className="px-3 py-1 text-xs font-bold text-cta bg-cta/10 border border-cta/20 rounded-full shadow-sm">
 Admin
 </div>
 )}
 </div>

 {!previewMode && (
 <>
 <ThemeToggle className="mr-1 hidden sm:block" />
 <HeaderNotifications />
 <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>
 <HeaderProfileMenu />
 </>
 )}
 </div>
 </div>

 {/* Mobile Right Actions (only rendered on mobile devices) */}
 <div className="flex md:hidden items-center gap-2 shrink-0">
 {!previewMode && (
 <>
 <ThemeToggle />
 <HeaderNotifications />
 <HeaderProfileMenu />
 </>
 )}
 </div>
 </header>
 );
}
