/**
 * ConsumerLayout — Shared layout for Guest and Traveler experiences.
 *
 * Replaces both PublicLayout (guest) and AuthenticatedLayout (traveler).
 * Provider and Admin layouts are NOT changed.
 *
 * Structure:
 *   <ConsumerHeader />         ← sticky travel-site nav
 *   <main>
 *     <Outlet />               ← page content (full-width, no sidebar)
 *   </main>
 *   <Footer />                 ← hidden on /planner routes
 */
import { Outlet, useLocation } from "react-router-dom";
import { ConsumerHeader } from "@/components/header/ConsumerHeader";
import { Footer } from "@/components/navigation/Footer";

export default function ConsumerLayout() {
  const location = useLocation();

  // Hide footer on planner routes (full-screen map editor)
  const hiddenFooterPaths = ["/planner", "/trips/create"];
  const showFooter = !hiddenFooterPaths.some((p) =>
    location.pathname.includes(p)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ConsumerHeader />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
