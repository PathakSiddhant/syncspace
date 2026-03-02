"use client";

import { useState } from "react";
import { AIAssistant } from "@/components/board/ai-assistant";
import { BoardTemplates } from "@/components/board/board-templates";
import { VoiceHuddle } from "@/components/board/voice-huddle";
import { LiveCodePanel } from "@/components/board/live-code-panel";
import { RecordingControls } from "@/components/board/recording-controls"; // 🔥 NEW: Imported Recording Controls

// 🔥 FIX: Added isOwner prop (default true for testing)
export function FeatureDock({ boardId, isOwner = true }: { boardId: string, isOwner?: boolean }) {
  const [activePanel, setActivePanel] = useState<"ai" | "templates" | "code" | null>(null);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-99999 pointer-events-none flex flex-col items-center">
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
        
        <AIAssistant isOpen={activePanel === "ai"} onToggle={() => setActivePanel(activePanel === "ai" ? null : "ai")} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>
        
        <BoardTemplates isOpen={activePanel === "templates"} onToggle={() => setActivePanel(activePanel === "templates" ? null : "templates")} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <LiveCodePanel isOpen={activePanel === "code"} onToggle={() => setActivePanel(activePanel === "code" ? null : "code")} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <VoiceHuddle boardId={boardId} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        {/* 🔥 THE MASTERPIECE: Analytics gaya, apna Recording button aagaya! */}
        <RecordingControls isOwner={isOwner} />

      </div>
    </div>
  );
}