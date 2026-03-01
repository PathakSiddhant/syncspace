"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useEditor, createShapeId, toRichText } from "tldraw";
// 🔥 FIX: Faltu icons (Blocks, Terminal) hata diye, sirf clean UI rakha hai
import { Code2, X, CopyCheck, FolderCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveCodePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function LiveCodePanel({ isOpen, onToggle }: LiveCodePanelProps) {
  const tldrawEditor = useEditor();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Welcome to SyncSpace Live Code!\n// Write your logic here...\n\nfunction init() {\n  console.log('Ready to collaborate!');\n}");

  const handlePinToBoard = () => {
    if (!code.trim()) return;

    const camera = tldrawEditor.getCamera();
    // Center it nicely on the screen
    const sX = camera.x + window.innerWidth / 4; 
    const sY = camera.y + window.innerHeight / 4;

    const bgId = createShapeId();
    const dotRedId = createShapeId();
    const dotYellowId = createShapeId();
    const dotGreenId = createShapeId();
    const textId = createShapeId();

    const lines = code.split('\n');
    const estimatedHeight = Math.max(150, lines.length * 30 + 80);
    const maxLineLength = lines.reduce((a, b) => a.length > b.length ? a : b).length;
    const estimatedWidth = Math.max(400, Math.min(800, maxLineLength * 12 + 60));

    // 1. CREATE THE TERMINAL SNAPSHOT
    tldrawEditor.createShapes([
      // A. Solid Jet Black Background (Ab koi khokhla grey nahi!)
      { 
        id: bgId, 
        type: 'geo', 
        x: sX, 
        y: sY, 
        props: { geo: 'rectangle', w: estimatedWidth, h: estimatedHeight, fill: 'solid', color: 'black' } 
      },
      // B. Mac Window Controls (Solid Red, Yellow, Green)
      { 
        id: dotRedId, 
        type: 'geo', 
        x: sX + 20, 
        y: sY + 20, 
        props: { geo: 'ellipse', w: 16, h: 16, fill: 'solid', color: 'red' } 
      },
      { 
        id: dotYellowId, 
        type: 'geo', 
        x: sX + 45, 
        y: sY + 20, 
        props: { geo: 'ellipse', w: 16, h: 16, fill: 'solid', color: 'yellow' } 
      },
      { 
        id: dotGreenId, 
        type: 'geo', 
        x: sX + 70, 
        y: sY + 20, 
        props: { geo: 'ellipse', w: 16, h: 16, fill: 'solid', color: 'green' } 
      },
      // C. The Code Text (Hacker Style Light-Green on Black, no crashes!)
      { 
        id: textId, 
        type: 'text', 
        x: sX + 20, 
        y: sY + 60, 
        props: { 
          text: code,    // Sirf text use kiya taaki koi property error na aaye
          font: 'mono', 
          size: 's', 
          color: 'light-green' // Best looking readable color on Tldraw's black shape
        } 
      }
    ]);

    // 2. GROUP THEM INTO ONE SOLID CARD
    tldrawEditor.groupShapes([bgId, dotRedId, dotYellowId, dotGreenId, textId]);

    setTimeout(() => {
      tldrawEditor.zoomToFit({ animation: { duration: 500 } });
    }, 100);
  };

  const getExtension = (lang: string) => {
    switch(lang) {
      case "javascript": return "js";
      case "typescript": return "ts";
      case "python": return "py";
      case "html": return "html";
      case "css": return "css";
      case "json": return "json";
      default: return "txt";
    }
  };

  return (
    <div className="relative flex items-center">
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-md transition-all ${isOpen ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white"}`}
        title="Live Code Editor"
      >
        <Code2 className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[750px] h-[500px] bg-[#1e1e1e] border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300 z-[99999]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1e1e1e] select-none cursor-move">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono tracking-wider">
              SyncSpace IDE — workspace/main.{getExtension(language)}
            </div>
            <button onClick={onToggle} className="text-neutral-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* 🔥 FIX: Clean Sidebar with ONLY the File icon */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 border-r border-[#1e1e1e]">
              <FolderCode className="w-5 h-5 text-white cursor-pointer transition-colors" />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              <div className="flex items-center justify-between bg-[#252526] pr-2 h-10">
                <div className="flex items-center h-full">
                  <div className="h-full px-5 flex items-center bg-[#1e1e1e] border-t-2 border-indigo-500 text-indigo-400 text-[13px] font-mono">
                    main.{getExtension(language)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#3c3c3c] text-[11px] text-neutral-200 border-none rounded px-2 py-1 outline-none cursor-pointer font-mono"
                  >
                    <option value="javascript">JS</option>
                    <option value="typescript">TS</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                  </select>
                  
                  <Button 
                    onClick={handlePinToBoard}
                    className="h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[4px] px-3 flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  >
                    <CopyCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium tracking-wide">Pin Snippet</span>
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full relative pt-2">
                <Editor
                  height="100%"
                  width="100%"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    wordWrap: "on",
                    padding: { top: 10, bottom: 10 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}