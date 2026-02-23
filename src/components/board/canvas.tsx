"use client";

import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";
import { useEffect } from "react";

interface CanvasProps {
  boardId: string;
  isReadonly?: boolean;
}

// 🔥 THE GOD MODE LOCK
function ReadonlyManager({ isReadonly }: { isReadonly: boolean }) {
  const editor = useEditor();
  
  useEffect(() => {
    if (!editor || !isReadonly) return;

    // 1. Initial Lock
    editor.updateInstanceState({ isReadonly: true });
    editor.setCurrentTool('hand'); // Force the hand (pan) tool

    // 2. The 100ms Aggressive Shield (Beats the Sync Engine without crashing)
    const lockInterval = setInterval(() => {
      // If sync engine tries to unlock it, lock it back instantly
      if (editor.getInstanceState() && !editor.getInstanceState().isReadonly) {
        editor.updateInstanceState({ isReadonly: true });
      }
      // If user somehow selects a pencil/shape, snatch it away instantly
      if (editor.getCurrentToolId() !== 'hand') {
        editor.setCurrentTool('hand');
      }
    }, 100);

    return () => clearInterval(lockInterval);
  }, [editor, isReadonly]);

  return null;
}

export function Canvas({ boardId, isReadonly = false }: CanvasProps) {
  const store = useSyncDemo({ roomId: `zyncro-live-board-${boardId}` });

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* 🔥 THE CSS VAPORIZER: Physically removes UI elements if Readonly */}
      {isReadonly && (
        <style>{`
          .tlui-toolbar,
          .tlui-style-panel,
          .tlui-navigation-zone,
          .tlui-menu-zone,
          .tlui-page-menu {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      )}

      <Tldraw store={store}>
        <ReadonlyManager isReadonly={isReadonly} />
      </Tldraw>
      
      {/* Permanent Visual Indicator */}
      {isReadonly && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full shadow-2xl z-9999 text-sm font-semibold text-neutral-300 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></span>
          View Only Mode (Locked)
        </div>
      )}
    </div>
  );
}