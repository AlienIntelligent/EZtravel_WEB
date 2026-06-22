import * as React from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "./sheet";
import { cn } from "@/utils/cn";



export function Drawer({ children, ...props }) {
  return <Sheet {...props}>{children}</Sheet>;
}

export const DrawerTrigger = SheetTrigger;
export const DrawerClose = SheetClose;
export const DrawerHeader = SheetHeader;
export const DrawerFooter = SheetFooter;
export const DrawerTitle = SheetTitle;
export const DrawerDescription = SheetDescription;

export const DrawerContent = React.forwardRef(


  ({ className, children, ...props }, ref) =>
  <SheetContent
    side="bottom"
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[60vh] flex-col rounded-t-[16px] border bg-background p-6 shadow-lg",
      className
    )}
    ref={ref}
    {...props}>
    
    <div className="mx-auto h-1.5 w-[60px] rounded-full bg-slate-300 dark:bg-slate-700 mb-6 cursor-pointer" />
    <div className="overflow-y-auto flex-1">{children}</div>
  </SheetContent>
);
DrawerContent.displayName = "DrawerContent";