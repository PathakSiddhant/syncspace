"use client";

import { useState } from "react";
// 🔥 FIX: Imported 'renderPlaintextFromRichText' to correctly read the new rich text system!
import { useEditor, renderPlaintextFromRichText } from "tldraw";
import { Bot, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
  const editor = useEditor();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const extractBoardText = () => {
    try {
      const shapes = editor.getCurrentPageShapes();
      let boardContent = "";
      
      shapes.forEach((shape: any) => {
        // 🚀 FIX: First check if 'richText' exists, if so, convert it. Otherwise fallback to old 'text' property
        let textValue = "";
        if (shape.props?.richText) {
          textValue = renderPlaintextFromRichText(shape.props.richText);
        } else if (shape.props?.text) {
          textValue = shape.props.text;
        }

        if (typeof textValue === "string" && textValue.trim() !== "") {
          boardContent += `- ${textValue.trim()}\n`;
        }
      });

      if (boardContent.trim() === "") {
        const rawData = JSON.stringify(shapes);
        const regex = /"text":"([^"]+)"/g;
        let match;
        while ((match = regex.exec(rawData)) !== null) {
          const cleanText = match[1].replace(/\\n/g, ' ').trim();
          if (cleanText !== "") boardContent += `- ${cleanText}\n`;
        }
      }
      return boardContent.trim();
    } catch (err) {
      console.error("Extraction error:", err);
      return "";
    }
  };

  const handleGenerateAI = async (type: "summary" | "action-items") => {
    const text = extractBoardText();
    if (!text) {
      alert("Board is empty! Add some sticky notes or text first.");
      return;
    }
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardText: text, type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setAiResult(data.result);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setAiResult("⚠️ Oops! AI system is currently resting. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <Button
        onClick={onToggle}
        variant="ghost"
        className={`group flex items-center gap-2.5 px-4 h-9 rounded-md transition-all duration-300 ${
          isOpen ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-transparent"
        }`}
      >
        <Bot className={`w-4 h-4 ${isOpen ? "text-indigo-400" : "text-neutral-400 group-hover:text-indigo-400"}`} />
        <span className="text-[13px] font-medium tracking-wide">SyncSpace AI</span>
        <Sparkles className={`w-3.5 h-3.5 ${isOpen ? "text-purple-400" : "text-neutral-500 group-hover:text-purple-400"}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[420px] bg-[#111111] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              What would you like me to do?
            </h3>
            <button onClick={onToggle} className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-white/[0.08] rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 flex gap-2 border-b border-white/[0.08] bg-black/20">
            <Button onClick={() => handleGenerateAI("summary")} disabled={isAnalyzing} className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium h-9 transition-colors shadow-none rounded-md">
              📝 Summarize Board
            </Button>
            <Button onClick={() => handleGenerateAI("action-items")} disabled={isAnalyzing} className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-medium h-9 transition-colors shadow-none rounded-md">
              ✅ Extract Action Items
            </Button>
          </div>

          <div className="p-5 h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 text-[13px] text-neutral-300 leading-relaxed bg-transparent">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                <p className="animate-pulse tracking-wide font-medium text-indigo-300">Summoning the AI...</p>
              </div>
            ) : !aiResult ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-3 text-center opacity-70">
                <Bot className="w-12 h-12 mb-2 text-neutral-600" />
                <p className="text-sm">Add some sticky notes and text to the canvas,<br/>then hit a button above!</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                <div className="flex items-center gap-2 text-emerald-400 mb-4 font-medium px-2.5 py-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 inline-flex">
                  <CheckCircle2 className="w-4 h-4" /> Task Completed
                </div>
                <div className="text-neutral-200">
                  {aiResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}