"use client";

import { useState } from "react";
import { useEditor } from "tldraw";
import { Bot, Sparkles, X, Loader2, CheckCircle2, Video, LayoutTemplate, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIAssistant() {
  const editor = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // 🔥 THE GOD-TIER BULLETPROOF EXTRACTOR
  const extractBoardText = () => {
    try {
      const shapes = editor.getCurrentPageShapes();
      let boardContent = "";

      // Attempt 1: Standard Extraction
      shapes.forEach((shape: any) => {
        const textValue = shape.props?.text || shape.text || "";
        if (typeof textValue === "string" && textValue.trim() !== "") {
          boardContent += `- ${textValue.trim()}\n`;
        }
      });

      // Attempt 2: The Regex "Hacker" Fallback
      // Agar standard tareeka fail hua (jaise tere case mein ho raha hai), toh ye chalega!
      if (boardContent.trim() === "") {
        console.warn("⚠️ Standard extraction failed, using Regex fallback...");
        const rawData = JSON.stringify(shapes);
        
        // Ye code poore data mein jahan bhi "text":"kuch bhi" likha hoga, usko nikaal lega
        const regex = /"text":"([^"]+)"/g;
        let match;
        while ((match = regex.exec(rawData)) !== null) {
          // Replace \n with actual newlines if Tldraw escaped them
          const cleanText = match[1].replace(/\\n/g, ' ').trim();
          if (cleanText !== "") {
            boardContent += `- ${cleanText}\n`;
          }
        }
      }

      console.log("🔥 FINAL EXTRACTED TEXT:\n", boardContent);
      // Agar phir bhi blank aaya, toh ye humein exact bimari bata dega!
      console.log("🧩 RAW SHAPES DATA:", shapes); 

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
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none flex flex-col items-center">
      
      <div className="pointer-events-auto flex items-center gap-1.5">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className={`group flex items-center gap-2.5 px-4 h-9 rounded-md transition-all duration-300 ${
            isOpen 
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
              : "bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-transparent"
          }`}
        >
          <Bot className={`w-4 h-4 ${isOpen ? "text-indigo-400" : "text-neutral-400 group-hover:text-indigo-400 transition-colors"}`} />
          <span className="text-[13px] font-medium tracking-wide">SyncSpace AI</span>
          <Sparkles className={`w-3.5 h-3.5 ${isOpen ? "text-purple-400" : "text-neutral-500 group-hover:text-purple-400 transition-colors"}`} />
        </Button>

        <div className="w-px h-5 bg-white/[0.1] mx-1"></div>

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-all" title="Video Suite (Coming Soon)">
          <Video className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-all" title="Templates (Coming Soon)">
          <LayoutTemplate className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-all" title="Analytics (Coming Soon)">
          <LineChart className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="pointer-events-auto absolute top-full mt-4 w-[420px] bg-[#111111] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              What would you like me to do?
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-white/[0.08] rounded-md">
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