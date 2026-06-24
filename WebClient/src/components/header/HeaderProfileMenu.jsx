import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Bell, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_ROUTES, PUBLIC_ROUTES, ADMIN_ROUTES, PROVIDER_APPROVED_ROUTES } from '../../router/routes';

export function HeaderProfileMenu() {
 const { user, role, logout } = useAuth();
 const [isOpen, setIsOpen] = useState(false);
 const menuRef = useRef(null);
 const navigate = useNavigate();

 // Handle outside click
 useEffect(() => {
 function handleClickOutside(event) {
 if (menuRef.current && !menuRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const handleLogout = () => {
 logout();
 navigate(PUBLIC_ROUTES.LOGIN);
 };

 const roleDisplayNames = {
  ADMIN: "Quản trị viên",
  PROVIDER_APPROVED: "Nhà cung cấp",
  PROVIDER: "Nhà cung cấp",
  PREMIUM_TRAVELER: "Khách hàng Premium",
  TRAVELER: "Khách hàng"
 };
 
 const displayName = roleDisplayNames[role] || "Khách hàng";
 const initials = displayName.substring(0, 2).toUpperCase();

 return (
 <div className="relative" ref={menuRef}>
 <button 
 className="flex items-center gap-2 p-0.5 rounded-full border border-transparent hover:border-border hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
 onClick={() => setIsOpen(!isOpen)}
 aria-expanded={isOpen}
 aria-haspopup="true"
 aria-label="Mở menu tài khoản"
 >
 <Avatar className="h-9 w-9 border border-border/50">
 <AvatarImage src={user?.avatar} alt={displayName} />
 <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">{initials}</AvatarFallback>
 </Avatar>
 </button>

 {isOpen && (
 <div className="absolute right-0 mt-2 w-[256px] overflow-hidden rounded-md border bg-background shadow-lg ring-1 ring-black/5 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
 <div className="px-4 py-3 border-b bg-muted/30">
 <p className="text-sm font-semibold leading-none text-foreground truncate">{displayName}</p>
 <p className="text-xs text-muted-foreground mt-1.5 truncate">{user?.email || 'user@example.com'}</p>
 </div>
 <div className="p-1.5">
 <Link 
 to={AUTH_ROUTES.PROFILE}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors"
 onClick={() => setIsOpen(false)}
 >
 <UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
 <span>Hồ sơ</span>
 </Link>
 <Link 
 to={AUTH_ROUTES.NOTIFICATIONS}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors"
 onClick={() => setIsOpen(false)}
 >
 <Bell className="mr-3 h-4 w-4 text-muted-foreground" />
 <span>Thông báo</span>
 </Link>
 </div>
 <div className="p-1.5 border-t">
 {user?.role === "ADMIN" && (
 <Link 
 to={ADMIN_ROUTES.DASHBOARD}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors mb-1"
 onClick={() => setIsOpen(false)}
 >
 <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
 <span>Trang quản trị</span>
 </Link>
 )}
 {user?.role === "PROVIDER_APPROVED" && (
 <Link 
 to={PROVIDER_APPROVED_ROUTES.DASHBOARD}
 className="flex items-center w-full px-2.5 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-colors mb-1"
 onClick={() => setIsOpen(false)}
 >
 <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
 <span>Trang nhà cung cấp</span>
 </Link>
 )}
 <button 
 onClick={handleLogout}
 className="flex items-center w-full px-2.5 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
 >
 <LogOut className="mr-3 h-4 w-4" />
 <span>Đăng xuất</span>
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
