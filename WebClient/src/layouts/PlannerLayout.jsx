/**
 * PlannerLayout — Full-screen layout for Trip Planner workspace.
 *
 * Uses ConsumerHeader (plannerMode=true) to maintain brand & avatar
 * consistency with the rest of the consumer product, while keeping
 * the workspace full-screen (no footer, no main padding).
 */
import { Outlet } from "react-router-dom";
import { ConsumerHeader } from "@/components/header/ConsumerHeader";

export default function PlannerLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Shared consumer header — planner mode hides nav links & search */}
      <ConsumerHeader plannerMode={true} />

      {/* Planner workspace — full remaining height */}
      <main className="flex-1 flex min-h-0 bg-background">
        <Outlet />
      </main>
    </div>
  );
}