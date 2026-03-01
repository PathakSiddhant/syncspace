"use client";

import { useState } from "react";
import { useEditor } from "tldraw";
import { Bot, Sparkles, X, Loader2, CheckCircle2, Copy, Check, FileText, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
  const editor = useEditor();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const extractBoardText = () => {
    try {
      const shapes = editor.getCurrentPageShapes();
      let boardContent = "";
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shapes.forEach((shape: any) => {
        let textValue = "";
        
        if (shape.props?.text) {
          textValue = shape.props.text;
        } 
        else if (shape.props?.richText) {
          try {
            textValue = shape.props.richText.textContent || "";
          } catch (error) {
            console.warn("AI Parser Skipped a malformed shape", error);
            textValue = " "; 
          }
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

  const handleCopy = () => {
    if (aiResult) {
      navigator.clipboard.writeText(aiResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAIResponse = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

      if (line.startsWith('### ') || line.startsWith('## ')) {
        return <h3 key={i} className="text-indigo-300 font-semibold mt-4 mb-2 text-[14px] flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> {line.replace(/^#+\s/, '')}</h3>;
      } 
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={i} className="flex items-start gap-2.5 my-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedLine.replace(/^[-*]\s/, '') }} />
          </div>
        );
      } 
      else if (/^\d+\.\s/.test(line)) {
        return (
           <div key={i} className="flex items-start gap-2 my-1.5 ml-1">
            <span className="text-indigo-400 font-bold text-xs mt-0.5 shrink-0 w-4">{line.match(/^\d+\./)?.[0]}</span>
            <span className="text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedLine.replace(/^\d+\.\s/, '') }} />
          </div>
        )
      } 
      else if (line.trim() === '') {
        return <div key={i} className="h-1.5" />;
      } 
      else {
        return <p key={i} className="text-neutral-300 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: parsedLine }} />;
      }
    });
  };

  return (
    <div className="relative flex items-center">
      <Button
        onClick={onToggle}
        variant="ghost"
        className={`group flex items-center gap-2.5 px-4 h-9 rounded-md transition-all duration-300 ${
          isOpen ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/3 hover:bg-white/8 text-neutral-300 hover:text-white border border-transparent"
        }`}
      >
        <Bot className={`w-4 h-4 ${isOpen ? "text-indigo-400" : "text-neutral-400 group-hover:text-indigo-400"}`} />
        <span className="text-[13px] font-medium tracking-wide">SyncSpace AI</span>
        <Sparkles className={`w-3.5 h-3.5 ${isOpen ? "text-purple-400" : "text-neutral-500 group-hover:text-purple-400"}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-105 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-50">
          
          <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-linear-to-r from-indigo-500/10 to-purple-500/10">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              SyncSpace Intelligence
            </h3>
            <button onClick={onToggle} className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 flex gap-2 border-b border-white/5 bg-[#161616]">
            <Button onClick={() => handleGenerateAI("summary")} disabled={isAnalyzing} className="flex-1 bg-[#222] hover:bg-indigo-500/20 text-neutral-300 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 text-xs font-medium h-9 transition-all shadow-none rounded-lg group">
              <FileText className="w-3.5 h-3.5 mr-2 text-indigo-400 group-hover:scale-110 transition-transform" /> Summarize
            </Button>
            <Button onClick={() => handleGenerateAI("action-items")} disabled={isAnalyzing} className="flex-1 bg-[#222] hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 text-xs font-medium h-9 transition-all shadow-none rounded-lg group">
              <ListChecks className="w-3.5 h-3.5 mr-2 text-emerald-400 group-hover:scale-110 transition-transform" /> Actions
            </Button>
          </div>

          <div className="p-5 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 text-[13px] text-neutral-300 leading-relaxed bg-[#0a0a0a] relative">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse" />
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400 relative z-10" />
                </div>
                <p className="animate-pulse tracking-wide font-medium text-indigo-300 text-xs uppercase">Analyzing Board Context...</p>
              </div>
            ) : !aiResult ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-3 text-center opacity-70">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 border border-white/10">
                  <Bot className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="text-sm">Add some sticky notes and text to the canvas,<br/>then hit a button above!</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium px-2.5 py-1 text-xs bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Task Completed
                  </div>
                  
                  <button 
                    onClick={handleCopy} 
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                
                <div className="bg-[#111] p-4 rounded-xl border border-white/5 shadow-inner">
                  {formatAIResponse(aiResult)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}