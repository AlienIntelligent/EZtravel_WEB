import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SIDEBAR_CONFIG } from './config';
import { SidebarSection } from './SidebarSection';

export function Sidebar({ isMobileOpen, setIsMobileOpen, previewMode = false }) {
  const { role, isAuthenticated } = useAuth();

  // Guest users should not render a sidebar
  if (!isAuthenticated && !previewMode) {
    return null;
  }

  // Filter sections that are applicable to the current role (or use all for preview)
  const effectiveRole = previewMode ? 'ADMIN' : role;
  const visibleSections = SIDEBAR_CONFIG.filter(section => section.roles.includes(effectiveRole));

  const closeMobileSidebar = () => setIsMobileOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-3 py-5">
        {visibleSections.map((section, idx) => (
          <SidebarSection 
            key={idx} 
            section={section} 
            role={effectiveRole} 
            onItemClick={closeMobileSidebar} 
          />
        ))}
      </div>
    </div>
  );

  const mobileDrawer = (
    <>
      {/* Mobile Drawer Overlay (Backdrop) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/50 md:hidden block cursor-pointer"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside 
        className="fixed inset-y-0 z-[10000] w-[272px] border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden"
        style={{ left: isMobileOpen ? '0' : '-272px' }}
      >
        {sidebarContent}
      </aside>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-[248px] flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex z-20">
        {sidebarContent}
      </aside>

      {/* Portaled Mobile Drawer */}
      {typeof document !== 'undefined' ? createPortal(mobileDrawer, document.body) : null}
    </>
  );
}
