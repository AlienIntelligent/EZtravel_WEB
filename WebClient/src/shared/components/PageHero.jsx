import React from 'react';
import { cn } from '@/lib/utils';

export default function PageHero({
  title,
  description,
  bgImage = '/images/bg_1.jpg', // Default nice background
  className,
  children
}) {
  return (
    <section className={cn("relative flex items-center overflow-hidden bg-slate-950 py-16 text-white min-h-[300px]", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url("${bgImage}")` }}
      />
      {/* Dark overlay ensuring text is readable in both light and dark mode contexts */}
      <div className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/70" />
      
      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
        {title && (
          <h1 className="font-sans text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-100 md:text-lg drop-shadow">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
