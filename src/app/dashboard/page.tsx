import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Your Workspaces</h2>
          <p className="text-neutral-400 mt-1">Manage your workspaces and team members.</p>
        </div>
        
        {/* We replaced the static button with our new Modal Component! */}
        <CreateWorkspaceModal />
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
        <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
        <p className="text-neutral-400 max-w-sm text-center mb-6">
          Create your first Zyncro workspace to start organizing your boards and collaborating with your team.
        </p>
        
        {/* We can use the modal here too if we want, but for now this is just a placeholder */}
        <CreateWorkspaceModal />
      </div>
    </div>
  );
}