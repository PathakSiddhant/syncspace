"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { Loader2 } from "lucide-react";
import { LiveList } from "@liveblocks/client";

interface RoomProps {
  children: ReactNode; 
  roomId: string;
}

export function Room({ children, roomId }: RoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null }} initialStorage={{ messages: new LiveList([]) }}>
        <ClientSideSuspense 
          fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#111111] text-emerald-500 z-99999">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-xs font-semibold text-neutral-400 animate-pulse tracking-widest uppercase">
                Loading Workspace...
              </p>
            </div>
          }
        >
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}