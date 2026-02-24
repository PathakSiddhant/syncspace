import { db } from "@/lib/db";
import { workspaces, boards } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { PlusCircle, Presentation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateBoardModal } from "@/components/modals/create-board-modal";
import { BoardOptions } from "@/components/board/board-options";
import { WorkspaceOptions } from "@/components/dashboard/workspace-options"; // 🔥 NEW IMPORT

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  // Await the params to avoid Next.js Promise errors
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
    .where(eq(workspaces.id, workspaceId));

  // 2. Security Check
  if (!workspace || workspace.ownerId !== userId) {
    notFound();
  }

  // 3. Fetch all boards inside this workspace
  const workspaceBoards = await db
    .select()
    .from(boards)
    .where(eq(boards.workspaceId, workspaceId))
    .orderBy(desc(boards.updatedAt));

  return (
    <div className="h-full flex flex-col">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800">
        <div>
          {/* 🔥 NEW WORKSPACE HEADER WITH SETTINGS MENU */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <span className="text-emerald-500 font-bold text-xl">
                {workspace.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight ml-2">
                {workspace.name}
              </h1>
              {/* THE NEW WORKSPACE SETTINGS MENU */}
              <WorkspaceOptions workspaceId={workspace.id} currentName={workspace.name} />
            </div>
          </div>
          <p className="text-neutral-400 mt-2">Manage all your canvas boards for this workspace here.</p>
        </div>
        
        {/* The Action Buttons */}
        <div className="flex items-center gap-3">
         <CreateBoardModal workspaceId={workspaceId} />
        </div>
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
          
          {/* Using our Modal with a custom button design as children! */}
          <CreateBoardModal workspaceId={workspaceId}>
            <Button className="bg-white text-black hover:bg-neutral-200 gap-2">
              <PlusCircle className="w-4 h-4" />
              Create First Board
            </Button>
          </CreateBoardModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* List of Boards */}
          {workspaceBoards.map((board) => (
            <Link 
              key={board.id} 
              href={`/board/${board.id}`}
              className="group relative h-32 flex flex-col justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="flex justify-between items-start z-10">
                <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-1 pr-2">
                  {board.title}
                </h3>
                {/* 🔥 THE 3-DOTS MENU */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <BoardOptions boardId={board.id} workspaceId={workspaceId} currentTitle={board.title} />
                </div>
              </div>
              
              <div className="text-xs text-neutral-500 z-10 flex items-center justify-between">
                <span>Edited just now</span>
                <span className="bg-neutral-800 px-2 py-1 rounded text-neutral-400 border border-neutral-700">Canvas</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}