import * as React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type, startIcon, endElement, ...props }, ref) => {
 const hasAdornment = !!(startIcon || endElement);

 const inputEl = (
 <input
 type={type}
 className={cn(
 "flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
 startIcon && "pl-10",
 endElement && "pr-10",
 className
 )}
 ref={ref}
 {...props}
 />
 );

 if (hasAdornment) {
 return (
 <div className="relative w-full">
 {startIcon && (
 <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-muted-foreground">
 {startIcon}
 </div>
 )}
 {inputEl}
 {endElement && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
 {endElement}
 </div>
 )}
 </div>
 );
 }

 return inputEl;
});
Input.displayName = "Input";

export { Input };