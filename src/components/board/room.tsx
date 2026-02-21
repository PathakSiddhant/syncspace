"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Loader2 } from "lucide-react";

export function Room({ 
  children, 
  roomId 
}: { 
  children: ReactNode; 
  roomId: string; 
}) {
  return (
    // Ye provider hamare auth API ko call karta hai access lene ke liye
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      
      {/* Ye provider ek specific board id ka "Room" banata hai */}
      <RoomProvider id={roomId}>
        
        {/* Jab tak WebSocket connection ban raha hai, ek mast loading screen dikhao */}
        <ClientSideSuspense fallback={
          <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-950 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="text-neutral-400 font-medium">Connecting to live room...</p>
          </div>
        }>
          {children}
        </ClientSideSuspense>

      </RoomProvider>
    </LiveblocksProvider>
  );
}