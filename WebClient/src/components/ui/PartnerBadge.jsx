import { CheckCircle, Crown, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";








export function PartnerBadge({
  type,
  showText = true,
  className,
  ...props
}) {
  const badgeType = type.toUpperCase();

  switch (badgeType) {
    case "VERIFIED_PARTNER":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
            className
          )}
          {...props}>
          
      <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
      {showText && <span>Verified Partner</span>}
    </div>);

    case "PREMIUM_PARTNER":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
            className
          )}
          style={{
            borderColor: "var(--color-premium)",
            color: "var(--color-premium)"
          }}
          {...props}>
          
      <Crown className="w-3.5 h-3.5" style={{ color: "var(--color-premium)" }} aria-hidden="true" />
      {showText && <span style={{ color: "var(--color-premium)" }}>Premium Partner</span>}
    </div>);

    case "FEATURED":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
            className
          )}
          {...props}>
          
      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
      {showText && <span>Featured</span>}
    </div>);

    case "TRENDING":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
            className
          )}
          {...props}>
          
      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
      {showText && <span>Trending</span>}
    </div>);

    default:
      return null;
  }
}