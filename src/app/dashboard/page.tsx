import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Your Boards</h2>
          <p className="text-neutral-400 mt-1">Manage your workspaces and collaborative canvases.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <PlusCircle className="w-4 h-4" />
          New Board
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
        <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No boards created yet</h3>
        <p className="text-neutral-400 max-w-sm text-center mb-6">
          Create your first Zyncro board to start drawing, planning, and collaborating with your team in real-time.
        </p>
        <Button className="bg-white text-black hover:bg-neutral-200">
          Create First Board
        </Button>
      </div>
    </div>
  );
}