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
import { LiveUsers } from "@/components/board/live-users";
import { LiveChat } from "@/components/board/live-chat";

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
  
  let finalAccessType = board.linkAccess; 
  if (isOwner) finalAccessType = "edit";

  if (finalAccessType === "private" && !isOwner) {
    notFound(); 
  }

  const isReadonly = finalAccessType === "view";

  return (
    <Room roomId={boardId}>
      <div className="h-screen w-full bg-[#0A0A0A] flex flex-col overflow-hidden text-white relative">
        
        {/* 💎 THE SOLID EDGE-TO-EDGE HEADER (No more floating nonsense) */}
        <div className="h-15 w-full bg-[#111111] border-b border-white/8 flex items-center justify-between px-4 shrink-0 relative z-50">
          
          {/* LEFT: Context & Navigation */}
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/workspaces/${board.workspaceId}`} className="p-2 bg-white/3 hover:bg-white/8 border border-white/5 rounded-lg transition-all text-neutral-400 hover:text-white">
              <ArrowLeft className="w-4.5 h-4.5" />
            </Link>
            <div className="h-5 w-px bg-white/8 mx-1"></div>
            <h1 className="font-semibold text-[15px] tracking-wide text-neutral-100">{board.title}</h1>
          </div>
          
          {/* CENTER: Empty space where our AI Dock will perfectly embed itself */}
          <div className="flex-1 flex justify-center items-center"></div>
          
          {/* RIGHT: Collaboration & Export */}
          <div className="flex items-center gap-2.5">
            {!isOwner && finalAccessType === "view" && (
              <span className="text-[11px] font-semibold tracking-wide bg-red-500/10 text-red-400 px-2.5 py-1.5 rounded-md border border-red-500/20">View Only</span>
            )}
            {!isOwner && finalAccessType === "edit" && (
              <span className="text-[11px] font-semibold tracking-wide bg-white/5 text-neutral-300 px-2.5 py-1.5 rounded-md border border-white/5">Guest Editor</span>
            )}
            
            <span className="text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-md border border-emerald-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Live
            </span>
            
            <div className="h-5 w-px bg-white/8 mx-1"></div>
            
            <LiveUsers boardId={boardId} isOwner={isOwner} />
            
            {isOwner && (
               <div className="ml-1">
                 <ShareModal boardId={boardId} boardTitle={board.title} initialLinkAccess={board.linkAccess} />
               </div>
            )}
          </div>
        </div>
        
        {/* THE CANVAS & LIVE CHAT */}
        <div className="flex-1 relative w-full h-full">
          <Canvas boardId={boardId} isReadonly={isReadonly} />
          
          <div className="absolute inset-0 z-100 pointer-events-none">
            <div className="pointer-events-auto">
              <LiveChat />
            </div>
          </div>
        </div>
        
      </div>
    </Room>
  );
}