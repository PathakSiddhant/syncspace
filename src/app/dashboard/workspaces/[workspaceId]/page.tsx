import { db } from "@/lib/db";
import { workspaces, boards } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { PlusCircle, Presentation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface WorkspacePageProps {
  // Added Promise here to prevent TypeScript errors when awaiting params
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  // 🔥 THE FIX: Await the params first!
  const resolvedParams = await params;
  const workspaceId = resolvedParams.workspaceId;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 1. Fetch the specific workspace from Neon DB
  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId)); // <-- Updated to use awaited workspaceId

  // 2. Security Check: If workspace doesn't exist or user doesn't own it, throw 404
  if (!workspace || workspace.ownerId !== userId) {
    notFound();
  }

  // 3. Fetch all boards inside this workspace
  const workspaceBoards = await db
    .select()
    .from(boards)
    .where(eq(boards.workspaceId, workspaceId)) // <-- Updated to use awaited workspaceId
    .orderBy(desc(boards.updatedAt));

  return (
    <div className="h-full flex flex-col">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            {workspace.name}
            <span className="text-sm font-normal px-2 py-1 bg-neutral-800 text-neutral-400 rounded-md">
              Workspace
            </span>
          </h2>
          <p className="text-neutral-400 mt-2">Manage all your canvas boards for this workspace here.</p>
        </div>
        
        {/* Placeholder for Create Board Button */}
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all">
          <PlusCircle className="w-4 h-4" />
          New Board
        </Button>
      </div>

      {/* Boards Grid or Empty State */}
      {workspaceBoards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
          <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
            <Presentation className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No boards created yet</h3>
          <p className="text-neutral-400 max-w-sm text-center mb-6">
            Your workspace is empty. Create your first Zyncro board to start collaborating in real-time.
          </p>
          <Button className="bg-white text-black hover:bg-neutral-200 gap-2">
            Create First Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaceBoards.map((board) => (
            <Link href={`/board/${board.id}`} key={board.id}>
              <div className="group relative flex flex-col justify-between p-6 h-48 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-emerald-900/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-neutral-800 rounded-lg text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">{board.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Updated {new Date(board.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center text-sm font-medium text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                  Enter Canvas <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}