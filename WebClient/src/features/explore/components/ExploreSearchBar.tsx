import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExploreSearchBarProps {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
}

export default function ExploreSearchBar({ value, onChange, placeholder = "Nhập tên địa điểm hoặc dịch vụ..." }: ExploreSearchBarProps) {
 return (
 <div className="relative w-full">
 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
 <Search className="w-4 h-4" aria-hidden="true" />
 </div>
 <Input
 type="text"
 aria-label="Tìm địa điểm hoặc dịch vụ"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="pl-9 pr-9 py-2 w-full bg-background /40 border-border text-sm rounded-lg"
 placeholder={placeholder}
 />
 {value && (
 <button
 onClick={() => onChange("")}
 className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-muted-foreground dark:hover:text-slate-200"
 aria-label="Xóa tìm kiếm"
 >
 <X className="w-4 h-4" aria-hidden="true" />
 </button>
 )}
 </div>
 );
}
