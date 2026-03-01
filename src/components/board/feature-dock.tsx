"use client";

import { useState } from "react";
import { AIAssistant } from "@/components/board/ai-assistant";
import { BoardTemplates } from "@/components/board/board-templates";
import { VoiceHuddle } from "@/components/board/voice-huddle";
import { LiveCodePanel } from "@/components/board/live-code-panel";
import { LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeatureDock({ boardId }: { boardId: string }) {
  const [activePanel, setActivePanel] = useState<"ai" | "templates" | "code" | null>(null);

  return (
    // 👈 FIX: z-[99999] changed to z-99999
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-99999 pointer-events-none flex flex-col items-center">
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
        
        <AIAssistant isOpen={activePanel === "ai"} onToggle={() => setActivePanel(activePanel === "ai" ? null : "ai")} />
        {/* 👈 FIX: bg-white/[0.1] changed to bg-white/10 */}
        <div className="w-px h-5 bg-white/10 mx-1"></div>
        
        <BoardTemplates isOpen={activePanel === "templates"} onToggle={() => setActivePanel(activePanel === "templates" ? null : "templates")} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <LiveCodePanel isOpen={activePanel === "code"} onToggle={() => setActivePanel(activePanel === "code" ? null : "code")} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        <VoiceHuddle boardId={boardId} />
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        {/* 👈 FIX: hover:bg-white/[0.08] changed to hover:bg-white/8 */}
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white transition-all" title="Analytics (Coming Soon)">
          <LineChart className="w-4 h-4" />
        </Button>

      </div>
    </div>
  );
}