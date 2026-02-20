import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { PlusCircle, LayoutGrid, Users, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { workspaces } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Get the current user
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. ⚡ SERVER-SIDE FETCHING: Direct DB call inside the component!
  const userWorkspaces = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId))
    .orderBy(desc(workspaces.createdAt));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Your Workspaces</h2>
          <p className="text-neutral-400 mt-1">Manage your workspaces and team members.</p>
        </div>
        
        <CreateWorkspaceModal />
      </div>

      {/* Conditionally render Empty State OR the Grid */}
      {userWorkspaces.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
          <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
            <PlusCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
          <p className="text-neutral-400 max-w-sm text-center mb-6">
            Create your first Zyncro workspace to start organizing your boards and collaborating with your team.
          </p>
          <CreateWorkspaceModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userWorkspaces.map((workspace) => (
            <Link href={`/dashboard/workspaces/${workspace.id}`} key={workspace.id}>
              <div className="group relative flex flex-col justify-between p-6 h-48 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-emerald-900/10">
                {/* Subtle glow effect on hover for that premium Aceternity feel */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-neutral-800 rounded-lg text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">{workspace.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 flex items-center gap-2">
                    <Users className="w-4 h-4" /> 1 Member
                  </p>
                </div>

                <div className="flex items-center text-sm font-medium text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                  Open Workspace <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}