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
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <Input
        type="text"
        aria-label="Tim dia diem hoac dich vu"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 py-2 w-full bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-sm rounded-lg"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Xóa tìm kiếm"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
