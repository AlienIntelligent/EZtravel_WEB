/**
 * ConsumerHeader — Shared header for ConsumerLayout and PlannerLayout.
 * Renders a travel-website navigation bar (Traveloka/Booking style).
 *
 * Props:
 * - plannerMode (bool): when true, shows planner-specific actions instead of
 * full nav links. Logo and avatar are always present.
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderNotifications } from "./HeaderNotifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
 Plane,
 Menu,
 X,
 Compass,
 Users,
 Sparkles,
 Map,
 Bell,
 User,
 LogOut,
 LogIn,
 UserPlus,
 ChevronDown,
 LayoutDashboard,
} from "lucide-react";
import { PUBLIC_ROUTES, AUTH_ROUTES, PREMIUM_ROUTES, ADMIN_ROUTES, PROVIDER_APPROVED_ROUTES } from "@/router/routes";
import { ThemeToggle } from "./ThemeToggle";

/* ─── Nav link definitions (role-aware) ─── */
const CONSUMER_NAV = [
 { label: "Khám phá", path: PUBLIC_ROUTES.EXPLORE, icon: Compass },
 { label: "Cộng đồng", path: PUBLIC_ROUTES.COMMUNITY, icon: Users },
 { label: "Chuyến đi", path: AUTH_ROUTES.TRIPS, icon: Map },
];

const TRAVELER_EXTRA_NAV = [];

/* ─── Avatar dropdown ─── */
function AvatarMenu({ user, role, logout }) {
 const [open, setOpen] = useState(false);
 const ref = useRef(null);
 const navigate = useNavigate();

 useEffect(() => {
 const close = (e) => {
 if (ref.current && !ref.current.contains(e.target)) setOpen(false);
 };
 document.addEventListener("mousedown", close);
 return () => document.removeEventListener("mousedown", close);
 }, []);

 const initials = user?.name
 ? user.name.substring(0, 2).toUpperCase()
 : user?.fullName
 ? user.fullName.substring(0, 2).toUpperCase()
 : "U";

 const isTraveler = ["TRAVELER", "PREMIUM_TRAVELER"].includes(role);

 const handleLogout = () => {
 logout();
 navigate(PUBLIC_ROUTES.HOME);
 setOpen(false);
 };

 return (
 <div className="relative" ref={ref}>
 <button
 id="consumer-avatar-btn"
 className="flex items-center gap-1.5 p-0.5 rounded-full border border-transparent hover:border-border hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
 onClick={() => setOpen((v) => !v)}
 aria-expanded={open}
 aria-label="User Menu"
 >
 <Avatar className="h-9 w-9 border border-border/50">
 <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
 <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
 {initials}
 </AvatarFallback>
 </Avatar>
 <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
 </button>

 {open && (
 <div className="absolute right-0 mt-2 w-[240px] overflow-hidden rounded-md border bg-background shadow-lg ring-1 ring-black/5 z-[200] origin-top-right animate-in fade-in zoom-in-95 duration-200">
 {/* User info */}
 <div className="px-4 py-3 border-b bg-muted/30">
 <p className="text-sm font-semibold leading-none text-foreground truncate">
 {user?.name || user?.fullName || "Khách hàng"}
 </p>
 <p className="text-xs text-muted-foreground mt-1.5 truncate">
 {user?.email}
 </p>
 </div>

 {/* Menu items */}
 <div className="p-1.5">
 <Link
 to={AUTH_ROUTES.PROFILE}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors gap-3"
 onClick={() => setOpen(false)}
 >
 <User className="h-4 w-4 text-muted-foreground" />
 Hồ sơ
 </Link>
 <Link
 to={AUTH_ROUTES.NOTIFICATIONS}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors gap-3"
 onClick={() => setOpen(false)}
 >
 <Bell className="h-4 w-4 text-muted-foreground" />
 Thông báo
 </Link>
 {isTraveler && (
 <Link
 to={AUTH_ROUTES.TRIPS}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors gap-3 mb-1"
 onClick={() => setOpen(false)}
 >
 <Map className="h-4 w-4 text-muted-foreground" />
 Chuyến đi của tôi
 </Link>
 )}
 {role === "ADMIN" && (
 <Link
 to={ADMIN_ROUTES.DASHBOARD}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors gap-3"
 onClick={() => setOpen(false)}
 >
 <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
 Trang quản trị
 </Link>
 )}
 {role === "PROVIDER_APPROVED" && (
 <Link
 to={PROVIDER_APPROVED_ROUTES.DASHBOARD}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors gap-3"
 onClick={() => setOpen(false)}
 >
 <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
 Trang nhà cung cấp
 </Link>
 )}
 </div>

 <div className="p-1.5 border-t">
 <button
 onClick={handleLogout}
 className="flex items-center w-full px-2.5 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors gap-3"
 >
 <LogOut className="h-4 w-4" />
 Đăng xuất
 </button>
 </div>
 </div>
 )}
 </div>
 );
}

/* ─── Mobile Drawer ─── */
function MobileDrawer({ open, onClose, navLinks, isAuthenticated, user, role, logout }) {
 const location = useLocation();
 const navigate = useNavigate();

 const isTraveler = isAuthenticated && ["TRAVELER", "PREMIUM_TRAVELER"].includes(role);

 const handleLogout = () => {
 logout();
 navigate(PUBLIC_ROUTES.HOME);
 onClose();
 };

 return (
 <>
 {/* Backdrop */}
 {open && (
 <div
 className="fixed inset-0 z-[9998] bg-black/40 md:hidden"
 onClick={onClose}
 />
 )}
 {/* Drawer */}
 <div
 className={`fixed inset-y-0 left-0 z-[9999] w-[280px] bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col`}
 style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
 >
 {/* Drawer header */}
 <div className="flex items-center justify-between px-5 py-4 border-b">
 <Link
 to={PUBLIC_ROUTES.HOME}
 className="flex items-center gap-2 font-bold text-xl text-primary"
 onClick={onClose}
 >
 <Plane className="h-5 w-5" />
 <span>ezTravel</span>
 </Link>
 <button
 onClick={onClose}
 className="p-1.5 rounded-lg hover:bg-muted transition-colors"
 aria-label="Đóng menu"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Nav links */}
 <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
 {navLinks.map((link) => (
 <Link
 key={link.path}
 to={link.path}
 onClick={onClose}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
 location.pathname.startsWith(link.path)
 ? "bg-primary/10 text-primary"
 : "text-foreground hover:bg-muted"
 }`}
 >
 <link.icon className="h-4 w-4 shrink-0" />
 {link.label}
 </Link>
 ))}

 {/* Authenticated traveler extras */}
 {isTraveler && (
 <>
 <div className="mt-3 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
 Tài khoản
 </div>
 <Link
 to={AUTH_ROUTES.TRIPS}
 onClick={onClose}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
 location.pathname.startsWith("/trips")
 ? "bg-primary/10 text-primary"
 : "text-foreground hover:bg-muted"
 }`}
 >
 <Map className="h-4 w-4 shrink-0" />
 Chuyến đi của tôi
 </Link>
 <Link
 to={AUTH_ROUTES.NOTIFICATIONS}
 onClick={onClose}
 className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
 >
 <Bell className="h-4 w-4 shrink-0" />
 Thông báo
 </Link>
 <Link
 to={AUTH_ROUTES.PROFILE}
 onClick={onClose}
 className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
 >
 <User className="h-4 w-4 shrink-0" />
 Hồ sơ của tôi
 </Link>
 </>
 )}
 </nav>

 {/* Bottom user area */}
 <div className="border-t px-4 py-4">
 {isAuthenticated ? (
 <div className="space-y-3">
 <div className="flex items-center gap-3 px-1">
 <Avatar className="h-9 w-9 border border-border/50">
 <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
 {(user?.name || user?.fullName || "U").substring(0, 2).toUpperCase()}
 </AvatarFallback>
 </Avatar>
 <div className="min-w-0">
 <p className="text-sm font-semibold truncate">{user?.name || user?.fullName}</p>
 <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
 </div>
 </div>
 <button
 onClick={handleLogout}
 className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
 >
 <LogOut className="h-4 w-4" />
 Đăng xuất
 </button>
 </div>
 ) : (
 <div className="flex flex-col gap-2">
 <Link
 to={PUBLIC_ROUTES.LOGIN}
 onClick={onClose}
 className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-semibold border border-border hover:bg-muted transition-colors"
 >
 <LogIn className="h-4 w-4" />
 Đăng nhập
 </Link>
 <Link
 to={PUBLIC_ROUTES.REGISTER}
 onClick={onClose}
 className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
 >
 <UserPlus className="h-4 w-4" />
 Đăng ký miễn phí
 </Link>
 </div>
 )}
 </div>
 </div>
 </>
 );
}

/* ─── ConsumerHeader (main export) ─── */
export function ConsumerHeader({ plannerMode = false }) {
 const { isAuthenticated, user, role, logout } = useAuth();
 const location = useLocation();
 const [mobileOpen, setMobileOpen] = useState(false);

 // Build nav links based on auth state
 const navLinks = [
 ...CONSUMER_NAV,
 ...(isAuthenticated ? TRAVELER_EXTRA_NAV : []),
 ];

 const isTraveler = isAuthenticated && ["TRAVELER", "PREMIUM_TRAVELER"].includes(role);

 return (
 <>
 <header className="consumer-header sticky top-0 z-[100] w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm shrink-0">
 <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

 {/* ── Left: Mobile hamburger + Logo ── */}
 <div className="flex items-center gap-3 shrink-0">
 {/* Mobile toggle */}
 <button
 id="consumer-mobile-menu-btn"
 className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
 onClick={() => setMobileOpen(true)}
 aria-label="Mở menu"
 >
 <Menu className="h-5 w-5" />
 </button>

 {/* Logo */}
 <Link
 to={PUBLIC_ROUTES.HOME}
 className="flex items-center gap-2 font-bold text-xl text-primary transition-opacity hover:opacity-90 shrink-0"
 >
 <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
 <Plane className="h-5 w-5 text-primary" />
 </div>
 <span className="text-base text-foreground sm:text-xl">ezTravel</span>
 </Link>
 </div>

 {/* ── Center: Desktop Nav + Search ── */}
 {!plannerMode && (
 <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-[600px]">
 {/* Nav links */}
 {navLinks.map((link) => (
 <Link
 key={link.path}
 to={link.path}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
 location.pathname.startsWith(link.path)
 ? "text-primary bg-primary/10"
 : "text-muted-foreground hover:text-foreground hover:bg-muted"
 }`}
 >
 {link.label}
 {link.premium && (
 <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
 Premium
 </span>
 )}
 </Link>
 ))}
 </div>
 )}

 {/* Planner mode center: trip name placeholder */}
 {plannerMode && (
 <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
 <span className="text-sm font-medium text-muted-foreground">
 Trình lập kế hoạch chuyến đi
 </span>
 </div>
 )}

 {/* ── Right: Search + Actions ── */}
 <div className="flex items-center gap-2 shrink-0">
 {/* Theme Toggle */}
 <ThemeToggle className="mr-1" />

 {/* Search — hidden in planner mode */}
 {!plannerMode && (
 <div className="hidden md:block">
 <HeaderSearch />
 </div>
 )}

 {isAuthenticated ? (
 <>
 {/* Notifications bell — hidden in planner mode on mobile */}
 {!plannerMode && (
 <HeaderNotifications />
 )}
 <AvatarMenu user={user} role={role} logout={logout} />
 </>
 ) : (
 <div className="hidden md:flex items-center gap-2">
 <Link
 to={PUBLIC_ROUTES.LOGIN}
 className="px-4 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
 >
 Đăng nhập
 </Link>
 <Link
 to={PUBLIC_ROUTES.REGISTER}
 className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
 >
 Đăng ký
 </Link>
 </div>
 )}
 </div>
 </div>
 </header>

 {/* Mobile Drawer */}
 <MobileDrawer
 open={mobileOpen}
 onClose={() => setMobileOpen(false)}
 navLinks={navLinks}
 isAuthenticated={isAuthenticated}
 user={user}
 role={role}
 logout={logout}
 />
 </>
 );
}
