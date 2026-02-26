"use client";

import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";
import { useEffect, useState } from "react";
import { useEventListener, useSelf, useBroadcastEvent } from "@liveblocks/react/suspense";

// 🔥 STEP 1: Import changed - Purana AIAssistant hata diya, ab FeatureDock aa gaya
import { FeatureDock } from "@/components/board/feature-dock";

interface CanvasProps {
  boardId: string;
  isReadonly?: boolean;
}

// 🔥 THE LOCATOR & LOCK ENGINE (Runs inside Tldraw)
function TldrawLiveblocksEngine({ dynamicReadonly }: { dynamicReadonly: boolean }) {
  const editor = useEditor();
  const me = useSelf();
  const broadcast = useBroadcastEvent();

  // 1. The Read-Only Guard
  useEffect(() => {
    if (!editor) return;
    if (dynamicReadonly) {
      editor.updateInstanceState({ isReadonly: true });
      editor.setCurrentTool('hand');
    } else {
      editor.updateInstanceState({ isReadonly: false });
    }

    const lockInterval = setInterval(() => {
      if (dynamicReadonly) {
        if (editor.getInstanceState() && !editor.getInstanceState().isReadonly) {
          editor.updateInstanceState({ isReadonly: true });
        }
        if (editor.getCurrentToolId() !== 'hand') {
          editor.setCurrentTool('hand');
        }
      }
    }, 100);

    return () => clearInterval(lockInterval);
  }, [editor, dynamicReadonly]);

  // 2. The Figma-Style Viewport Locator (Walkie-Talkie)
  useEventListener(({ event }) => {
    const e = event as any;
    if (!editor || !me.info?.email) return;

    if (e.type === "GOTO_REQUEST" && e.targetEmail === me.info.email) {
      const camera = editor.getCamera();
      broadcast({ 
        type: "GOTO_RESPONSE", 
        requesterEmail: e.requesterEmail, 
        camera: { x: camera.x, y: camera.y, z: camera.z } 
      });
    }

    if (e.type === "GOTO_RESPONSE" && e.requesterEmail === me.info.email) {
      editor.setCamera({ x: e.camera.x, y: e.camera.y, z: e.camera.z });
    }
  });

  return null;
}

export function Canvas({ boardId, isReadonly = false }: CanvasProps) {
  const store = useSyncDemo({ roomId: `zyncro-live-board-${boardId}` });
  const [dynamicReadonly, setDynamicReadonly] = useState(isReadonly);
  const me = useSelf();

  useEventListener(({ event }) => {
    const customEvent = event as any;
    if (customEvent.type === "ROLE_CHANGE" && customEvent.email === me.info?.email) {
      setDynamicReadonly(customEvent.newRole === "view");
    }
  });

  return (
    <div className="absolute inset-0 w-full h-full">
      {dynamicReadonly && (
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

      <Tldraw 
        store={store}
        components={{ TopPanel: () => null, SharePanel: () => null }}
      >
        {/* The Liveblocks Engine */}
        <TldrawLiveblocksEngine dynamicReadonly={dynamicReadonly} />
        
        {/* 🔥 YAHAN AB MASTER DOCK AAYEGA! */}
        <FeatureDock />
      </Tldraw>
      
      {dynamicReadonly && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full shadow-2xl z-9999 text-sm font-semibold text-neutral-300 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></span>
          View Only Mode (Locked)
        </div>
      )}
    </div>
  );
}