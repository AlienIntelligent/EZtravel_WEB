import { Outlet, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { PUBLIC_ROUTES } from '../router/routes';
import { Button } from '../components/ui/button';

export default function PublicLayout() {
 return (
 <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
 {/* Header Slot */}
 <header className="h-[64px] w-full border-b flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
 <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg text-primary">
 <Plane className="h-6 w-6" />
 <span>ezTravel</span>
 </Link>
 <div className="flex items-center gap-2 sm:gap-4">
 <Button variant="ghost" asChild className="hidden sm:inline-flex">
 <Link to={PUBLIC_ROUTES.LOGIN}>Đăng nhập</Link>
 </Button>
 <Button asChild>
 <Link to={PUBLIC_ROUTES.REGISTER}>Đăng ký</Link>
 </Button>
 </div>
 </header>

 <div className="flex flex-1 overflow-hidden">

 {/* Content Slot */}
 <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
 <Outlet />
 </main>
 </div>

 {/* Footer Slot */}
 <footer className="h-[64px] w-full border-t flex-shrink-0 bg-muted/50 p-4 flex items-center justify-center">
 Public Footer Placeholder
 </footer>
 </div>
 );
}