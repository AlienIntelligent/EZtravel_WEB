import { NavLink } from 'react-router-dom';

export function SidebarItem({ item, onClick }) {
 const { label, route, icon: Icon, status } = item;
 
 if (status === 'hidden') {
 return null;
 }

 if (status === 'coming-soon' || status === 'comingSoon' || status === 'disabled') {
 return (
 <div
 className="flex cursor-not-allowed select-none items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground opacity-60"
 title={`${label} (Coming Soon)`}
 >
 {Icon && <Icon className="h-[18px] w-[18px]" />}
 <span className="text-[15px]">{label}</span>
 <span className="ml-auto rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
 Sắp có
 </span>
 </div>
 );
 }

 return (
 <NavLink
 to={route}
 end={route === '/'} // exact match for root
 onClick={onClick}
 className={({ isActive }) =>
 `flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
 isActive 
 ? 'bg-primary/10 text-primary font-semibold shadow-[inset_3px_0_0_0_hsl(var(--primary))]' 
 : 'text-muted-foreground hover:bg-muted hover:text-foreground'
 }`
 }
 >
 {Icon && <Icon className="h-[18px] w-[18px]" />}
 <span className="text-sm">{label}</span>
 </NavLink>
 );
}
