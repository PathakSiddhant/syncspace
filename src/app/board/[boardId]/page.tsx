import { db } from "@/lib/db";
import { boards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@/components/board/canvas";
import { Room } from "@/components/board/room";
import { ShareModal } from "@/components/board/share-modal";

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

  if (!board) {
    notFound();
  }

  // 🔥 DETERMINE IF CURRENT USER IS THE OWNER
  const isOwner = board.creatorId === userId;

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col overflow-hidden text-white">
      {/* Board Header / Topbar */}
      <div className="h-14 border-b border-neutral-800 bg-neutral-900/50 flex items-center px-4 justify-between shrink-0 relative z-50">
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
        
        <div className="flex items-center gap-3">
          {/* Agar user owner nahi hai, toh use sirf "View Only" ya "Guest" badge dikhega */}
          {!isOwner && (
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded border border-neutral-700 mr-2">
              Guest Access
            </span>
          )}
          
          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 mr-2">
            Live
          </span>
          
          {/* 🔥 ONLY RENDER SHARE BUTTON IF IS OWNER */}
          {isOwner && <ShareModal boardId={boardId} boardTitle={board.title} />}
        </div>
      </div>
      
      {/* THE ACTUAL INFINITE CANVAS WRAPPED IN LIVE ROOM */}
      <div className="flex-1 relative w-full h-full">
        <Room roomId={boardId}>
          <Canvas boardId={boardId} />
        </Room>
      </div>
    </div>
  );
}