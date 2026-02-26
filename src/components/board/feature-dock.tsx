"use client";

import { useState } from "react";
import { AIAssistant } from "@/components/board/ai-assistant";
import { BoardTemplates } from "@/components/board/board-templates";
import { Video, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeatureDock() {
  // 🧠 State Management: Controls which panel is open ("ai", "templates", or null)
  const [activePanel, setActivePanel] = useState<"ai" | "templates" | null>(null);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-99999 pointer-events-none flex flex-col items-center">
      <div className="pointer-events-auto flex items-center gap-1.5">
        
        {/* Child 1: AI Assistant */}
        <AIAssistant 
          isOpen={activePanel === "ai"} 
          onToggle={() => setActivePanel(activePanel === "ai" ? null : "ai")} 
        />

        <div className="w-px h-5 bg-white/10 mx-1"></div>

        {/* Child 2: Templates */}
        <BoardTemplates 
          isOpen={activePanel === "templates"} 
          onToggle={() => setActivePanel(activePanel === "templates" ? null : "templates")} 
        />

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white transition-all" title="Video Suite (Coming Soon)">
          <Video className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white transition-all" title="Analytics (Coming Soon)">
          <LineChart className="w-4 h-4" />
        </Button>

      </div>
    </div>
  );
}