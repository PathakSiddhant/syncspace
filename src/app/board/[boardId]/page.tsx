import { db } from "@/lib/db";
import { boards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  // Await params directly per Next.js 14/15 standards
  const resolvedParams = await params;
  const boardId = resolvedParams.boardId;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the specific board
  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, boardId));

  // Security Check
  if (!board || board.creatorId !== userId) {
    notFound();
  }

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col overflow-hidden text-white">
      {/* Board Header / Topbar */}
      <div className="h-14 border-b border-neutral-800 bg-neutral-900/50 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/workspaces/${board.workspaceId}`}
            className="p-2 hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-neutral-800"></div>
          <h1 className="font-semibold text-lg tracking-tight">{board.title}</h1>
        </div>
        
        {/* Placeholder for future collaboration avatars */}
        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">
            Live Setup Pending
          </span>
        </div>
      </div>
      
      {/* The Infinite Canvas Area */}
      <div className="flex-1 relative bg-[#0f0f0f] w-full h-full flex items-center justify-center">
        {/* Dot pattern background for that premium canvas feel */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 font-medium">Initializing Whiteboard Engine...</p>
        </div>
      </div>
    </div>
  );
}