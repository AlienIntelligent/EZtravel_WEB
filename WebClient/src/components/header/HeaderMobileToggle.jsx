import { Menu, X } from 'lucide-react';

export function HeaderMobileToggle({ isMobileOpen, onToggle }) {
  return (
    <button 
      className="md:hidden flex items-center justify-center h-10 w-10 mr-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20" 
      onClick={onToggle}
      aria-label="Toggle Menu"
    >
      {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
