import { Map, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlannerMap from "./map/PlannerMap";
import BudgetPanel from "./BudgetPanel";

export default function PlannerRightPanel() {
 return (
 <aside className="hidden h-full w-[30%] min-w-[340px] max-w-[460px] shrink-0 flex-col border-l border-border bg-background lg:flex">
 <Tabs defaultValue="map" className="flex h-full min-h-0 flex-1 flex-col">
 <div className="shrink-0 border-b border-border p-3">
 <TabsList className="grid w-full grid-cols-2">
 <TabsTrigger value="map" className="gap-2 text-xs">
 <Map className="h-3.5 w-3.5" aria-hidden="true" />
 Bản đồ
 </TabsTrigger>
 <TabsTrigger value="budget" className="gap-2 text-xs">
 <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
 Chi phí
 </TabsTrigger>
 </TabsList>
 </div>
 <TabsContent value="map" className="relative m-0 min-h-0 flex-1 overflow-hidden">
 <PlannerMap />
 </TabsContent>
 <TabsContent value="budget" className="m-0 min-h-0 flex-1 overflow-y-auto p-3">
 <BudgetPanel />
 </TabsContent>
 </Tabs>
 </aside>
 );
}
