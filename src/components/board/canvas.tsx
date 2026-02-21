"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css"; // Required for premium styling

interface CanvasProps {
  boardId: string;
}

export function Canvas({ boardId }: CanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* persistenceKey ensures that if you draw something and refresh the page, 
        your drawing stays there (saved locally) for this specific board ID! 
      */}
      <Tldraw persistenceKey={`board-${boardId}`} />
    </div>
  );
}