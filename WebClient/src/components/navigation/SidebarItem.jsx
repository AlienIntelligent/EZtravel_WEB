import { NavLink } from 'react-router-dom';

export function SidebarItem({ item, onClick }) {
  const { label, route, icon: Icon, status } = item;
  
  if (status === 'hidden') {
    return null;
  }

  if (status === 'coming-soon' || status === 'comingSoon' || status === 'disabled') {
    return (
      <div
        className="flex cursor-not-allowed select-none items-center gap-3 rounded-md px-3 py-2.5 text-slate-400 opacity-60"
        title={`${label} (Coming Soon)`}
      >
        {Icon && <Icon className="h-[18px] w-[18px]" />}
        <span className="text-[15px]">{label}</span>
        <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
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
            ? 'bg-red-50 text-red-600 font-semibold shadow-[inset_3px_0_0_0_#ff5a5f]' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {Icon && <Icon className="h-[18px] w-[18px]" />}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
