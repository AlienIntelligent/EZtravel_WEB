import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/header/Header';

export default function AuthenticatedLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-shell flex flex-col h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="shell-body flex flex-1 overflow-hidden relative">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="content-area flex-1 overflow-y-auto bg-slate-50 relative z-0 p-6">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
