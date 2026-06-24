import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
 title: string;
 description: string;
 icon?: LucideIcon;
 action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
 return (
 <div className="flex flex-col items-center justify-center p-8 text-center bg-background border border-border rounded-xl shadow-sm min-h-[200px] w-full">
 {Icon && (
 <div className="p-3 mb-4 rounded-full bg-background /50 text-muted-foreground ">
 <Icon className="w-8 h-8" aria-hidden="true" />
 </div>
 )}
 <h3 className="text-lg font-sans font-semibold text-foreground mb-1">
 {title}
 </h3>
 <p className="text-sm text-muted-foreground max-w-sm mb-4">
 {description}
 </p>
 {action && <div className="mt-2">{action}</div>}
 </div>
 );
}
