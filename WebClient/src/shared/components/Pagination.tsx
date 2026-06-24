import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
 if (totalPages <= 1) return null;

 const getPageNumbers = () => {
 const pages = [];
 
 if (totalPages <= 7) {
 for (let i = 1; i <= totalPages; i++) {
 pages.push(i);
 }
 } else {
 if (currentPage <= 4) {
 for (let i = 1; i <= 5; i++) pages.push(i);
 pages.push('...');
 pages.push(totalPages);
 } else if (currentPage >= totalPages - 3) {
 pages.push(1);
 pages.push('...');
 for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
 } else {
 pages.push(1);
 pages.push('...');
 for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
 pages.push('...');
 pages.push(totalPages);
 }
 }
 return pages;
 };

 const pages = getPageNumbers();

 return (
 <div className="flex items-center justify-center gap-2 mt-6">
 <button 
 className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
 disabled={currentPage === 1}
 onClick={() => onPageChange(currentPage - 1)}
 >
 <ChevronLeft className="w-5 h-5" />
 </button>
 
 <div className="flex items-center gap-1.5 sm:gap-2">
 {pages.map((page, idx) => (
 page === '...' ? (
 <div key={`ellipsis-${idx}`} className="flex items-center justify-center w-8 h-10 text-muted-foreground">
 <MoreHorizontal className="w-4 h-4" />
 </div>
 ) : (
 <button 
 key={`page-${page}`}
 className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
 currentPage === page 
 ? 'bg-primary text-white shadow-sm' 
 : 'border border-border text-foreground hover:bg-muted'
 }`}
 onClick={() => typeof page === 'number' && onPageChange(page)}
 >
 {page}
 </button>
 )
 ))}
 </div>

 <button 
 className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
 disabled={currentPage === totalPages}
 onClick={() => onPageChange(currentPage + 1)}
 >
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 );
};

export default Pagination;
