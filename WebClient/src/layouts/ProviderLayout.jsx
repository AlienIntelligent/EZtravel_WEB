import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/header/Header';

export default function ProviderLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-shell flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="shell-body flex flex-1 overflow-hidden relative">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="content-area relative z-0 flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-5 lg:p-6">
          <div className="operations-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
