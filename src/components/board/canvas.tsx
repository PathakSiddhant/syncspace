"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";

interface CanvasProps {
  boardId: string;
}

export function Canvas({ boardId }: CanvasProps) {
  // 🔥 THE MAGIC FIX: Ye 1 line tera poora real-time data, cursors aur drawing sync karegi!
  // Hum isko unique room name de rahe hain taaki har board alag rahe.
  const store = useSyncDemo({ roomId: `zyncro-live-board-${boardId}` });

  return (
    <div className="absolute inset-0 w-full h-full">
      <Tldraw store={store} />
    </div>
  );
}