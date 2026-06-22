import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

export function FormInput({
  label,
  error,
  id,
  startIcon,
  endElement,
  children,
  className,
  ...props
}) {
  const child = React.Children.only(children);
  const hasError = !!error;
  const errorMessage = typeof error === 'object' ? error?.message : error;
  const inputId = id || child.props.id;

  return (
    <div className={cn("w-full space-y-2", className)} {...props}>
      {label && (
        <Label htmlFor={inputId} className="select-none block w-full">
          {label}
        </Label>
      )}
      {React.cloneElement(child, {
        id: inputId,
        startIcon: startIcon || child.props.startIcon,
        endElement: endElement || child.props.endElement,
        className: cn(
          child.props.className,
          hasError && "border-danger focus-visible:ring-danger focus-visible:border-danger"
        )
      })}
      {hasError && errorMessage && (
        <p className="text-sm text-danger mt-1 font-medium animate-in fade-in duration-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
