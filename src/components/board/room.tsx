"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { Loader2 } from "lucide-react";
import { LiveList } from "@liveblocks/client"; // 🔥 NEW: Real-time data structures

interface RoomProps {
  children: ReactNode;
  roomId: string;
}

export function Room({ children, roomId }: RoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider 
        id={roomId} 
        initialPresence={{}}
        // 🔥 NEW: Creating an empty real-time list to hold our chat messages!
        initialStorage={{ messages: new LiveList([]) }} 
      >
        <ClientSideSuspense 
          fallback={
            <div className="absolute inset-0 h-screen w-screen flex flex-col items-center justify-center bg-neutral-950 text-emerald-500 z-99999">
              <Loader2 className="w-12 h-12 animate-spin mb-6" />
              <p className="text-sm font-medium text-neutral-400 animate-pulse tracking-wider uppercase">
                Entering Zyncro Canvas...
              </p>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}