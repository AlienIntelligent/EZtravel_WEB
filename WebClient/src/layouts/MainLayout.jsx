/**
 * @deprecated MainLayout — NOT mounted by any route as of FE-0112C.
 *
 * Retained as visual reference only. Do NOT use in new routes.
 * The active consumer layout is: src/layouts/ConsumerLayout.jsx
 *
 * This file preserves legacy navigation patterns and footer styles
 * from pages_legacy that may be consulted for design reference.
 */
import { Outlet, Link, useLocation } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationDropdown } from "@/modules/community/components/NotificationDropdown";
import { Footer } from "@/components/navigation/Footer";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = [
  { name: "Khám phá", path: "/explore" },
  { name: "Lên lịch trình", path: "/planner" },
  { name: "Cộng đồng", path: "/community" }];


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-slate-900 text-white">
        <div className="container mx-auto flex h-[72px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold text-white">EZTravel.</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) =>
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-white"}`
                }>
                
                  {link.name}
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop User Panel */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ?
              <>
                  <span className="text-sm font-medium">
                    Hi, {user?.fullName || user?.email}
                  </span>
                  <Avatar>
                    <AvatarFallback className="text-slate-900">
                      {user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <NotificationDropdown />
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:text-primary hover:bg-slate-800 text-white cursor-pointer">
                  
                    Đăng xuất
                  </Button>
                </> :

              <>
                  <Button variant="ghost" asChild className="hover:text-primary hover:bg-slate-800 text-white">
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                    <Link to="/register">Đăng ký</Link>
                  </Button>
                </>
              }
            </div>

            {/* Mobile Nav Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800 cursor-pointer">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-serif text-2xl font-bold text-primary">EZTravel.</span>
                  </div>
                  <nav className="p-6 flex flex-col gap-4">
                    {navLinks.map((link) =>
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-base font-medium transition-colors ${
                      location.pathname === link.path ?
                      "text-primary" :
                      "text-slate-600 dark:text-slate-300"}`
                      }>
                      
                        {link.name}
                      </Link>
                    )}

                    <hr className="my-2 border-slate-200 dark:border-slate-800" />

                    {isAuthenticated ?
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="text-slate-900">
                              {user?.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user?.fullName || user?.email}
                          </span>
                        </div>
                        <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full justify-center">
                        
                          Đăng xuất
                        </Button>
                      </div> :

                    <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild className="w-full justify-center">
                          <Link to="/login">Đăng nhập</Link>
                        </Button>
                        <Button asChild className="w-full justify-center bg-primary text-white">
                          <Link to="/register">Đăng ký</Link>
                        </Button>
                      </div>
                    }
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className={`flex-1 flex flex-col ${location.pathname.startsWith("/planner") ? "overflow-hidden" : ""}`}>
        <Outlet />
      </main>

      {!location.pathname.startsWith("/planner") && <Footer />}
    </div>);

}