import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export function HeaderSearch() {
  return (
    <div className="relative w-full min-w-[240px] max-w-[400px] group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" aria-hidden="true" />
      </div>
      <Input
        type="text"
        aria-label="Tim diem den, lich trinh hoac dich vu"
        placeholder="Tìm điểm đến, lịch trình, dịch vụ..."
        className="w-full h-11 pl-12 pr-4 bg-muted/40 border-border/50 hover:bg-muted/60 hover:border-border focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary rounded-full shadow-sm transition-all text-[15px] truncate"
      />
    </div>
  );
}
