import { db } from "@/lib/db";
import { boards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Canvas } from "@/components/board/canvas";
import { Room } from "@/components/board/room";
import { ShareModal } from "@/components/board/share-modal";

interface BoardPageProps {
  params: { boardId: string; };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const resolvedParams = await params;
  const boardId = resolvedParams.boardId;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
  if (!board) notFound();

  const isOwner = board.creatorId === user.id;
  
  // Link Logic
  let finalAccessType = board.linkAccess; // "private", "view", or "edit"
  
  if (isOwner) finalAccessType = "edit";

  // The Bouncer
  if (finalAccessType === "private" && !isOwner) {
    notFound(); // 404 if it's private and you're not the owner
  }

  const isReadonly = finalAccessType === "view";

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col overflow-hidden text-white">
      <div className="h-14 border-b border-neutral-800 bg-neutral-900/50 flex items-center px-4 justify-between shrink-0 relative z-50">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/workspaces/${board.workspaceId}`} className="p-2 hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-neutral-800"></div>
          <h1 className="font-semibold text-lg tracking-tight">{board.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!isOwner && finalAccessType === "view" && (
            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 mr-2">View Only</span>
          )}
          {!isOwner && finalAccessType === "edit" && (
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded border border-neutral-700 mr-2">Guest Editor</span>
          )}
          
          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 mr-2">Live</span>
          
          {isOwner && <ShareModal boardId={boardId} boardTitle={board.title} initialLinkAccess={board.linkAccess} />}
        </div>
      </div>
      
      <div className="flex-1 relative w-full h-full">
        <Room roomId={boardId}>
          <Canvas boardId={boardId} isReadonly={isReadonly} />
        </Room>
      </div>
    </div>
  );
}