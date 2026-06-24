import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

export function SidebarSection({ section, role, onItemClick }) {
 const [isOpen, setIsOpen] = useState(true);

 // Filter items based on role and status
 const visibleItems = section.items.filter(item => 
 item.roles.includes(role) && item.status !== 'hidden'
 );

 if (visibleItems.length === 0) {
 return null;
 }

 return (
 <div className="mb-6">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex w-full items-center justify-between px-2 py-2 text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
 >
 <span>{section.title}</span>
 {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
 </button>
 
 <div className={`mt-2 space-y-1 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
 {visibleItems.map((item, index) => (
 <SidebarItem key={index} item={item} onClick={onItemClick} />
 ))}
 </div>
 </div>
 );
}
