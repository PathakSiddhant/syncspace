"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Video, Square, Play, Circle, X, Pause, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingControlsProps {
  isOwner?: boolean; 
}

export function RecordingControls({ isOwner = false }: RecordingControlsProps) {
  // --- 1. STATE & REFS ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [camSize, setCamSize] = useState(160); 
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, size: 0 });

  // --- 2. CORE FUNCTIONS ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setIsCameraActive(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === "NotReadableError") {
        alert("Camera is already in use by another app. Please close it and try again.");
      } else {
        alert("Please allow camera and microphone access to record.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
    setIsPaused(false);
  };

  // --- 3. EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setPos({
        x: window.innerWidth - 300,
        y: window.innerHeight - 320
      });
      setMounted(true);
    }, 0);
    
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive, camSize]); 

  // --- 4. DRAG & RESIZE HANDLERS ---
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeStart.current = { x: e.clientX, y: e.clientY, size: camSize };
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    const delta = Math.max(dx, dy); 
    const newSize = Math.max(120, Math.min(450, resizeStart.current.size + delta)); // Thoda bada min-size kar diya (120px)
    setCamSize(newSize);
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // --- 5. RENDER ---
  if (!isOwner) return null;

  const floatingUI = (
    <div 
      style={{ left: pos.x, top: pos.y }}
      className={`fixed z-99999 flex flex-col items-center gap-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} animate-in fade-in zoom-in-95 duration-200`}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      
      {/* 📸 Resizable Camera Wrapper (NO overflow-hidden here!) */}
      <div style={{ width: camSize, height: camSize }} className="relative group">
        
        {/* Actual Video Circle */}
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#222] shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover mirror-mode pointer-events-none"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* Drag Indicator (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-white/50 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <GripHorizontal className="w-5 h-5" />
        </div>

        {/* ❌ Close Button (Outside Top-Right Edge) */}
        <button 
          onClick={stopCamera}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-xl z-50 border-2 border-[#111]"
          title="Close Camera"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 📐 Resize Handle (Outside Bottom-Right Edge) */}
        <div 
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          className="resize-handle absolute bottom-0 right-0 w-7 h-7 bg-indigo-500 hover:bg-indigo-400 rounded-full cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-50 shadow-xl border-2 border-[#111]"
          title="Drag to Resize"
        >
          <div className="w-2 h-2 bg-white rounded-full pointer-events-none" />
        </div>
        
        {/* 🔴 REC Indicator (Moved completely to the TOP outside the circle) */}
        {isRecording && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#111] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl z-50">
            <div className={`w-2.5 h-2.5 bg-red-500 rounded-full ${isPaused ? '' : 'animate-pulse'}`} />
            <span className="text-[10px] text-white font-bold tracking-widest uppercase mt-px">
              {isPaused ? 'PAUSED' : 'REC'}
            </span>
          </div>
        )}
      </div>

      {/* 🎛️ Smart Control Panel */}
      <div className="flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        
        {!isRecording ? (
          <Button 
            onClick={() => setIsRecording(true)} 
            variant="ghost" 
            className="h-10 px-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl gap-2.5 text-sm font-semibold transition-all group"
          >
            <Circle className="w-4 h-4 fill-red-400 group-hover:fill-red-500 transition-colors" /> Start Recording
          </Button>
        ) : (
          <Button 
            onClick={() => { setIsRecording(false); setIsPaused(false); }} 
            variant="ghost" 
            className="h-10 px-5 bg-[#2a2a2a] hover:bg-[#333] text-neutral-200 border border-white/10 hover:border-white/20 rounded-xl gap-2.5 text-sm font-semibold transition-all shadow-inner group"
          >
            <Square className="w-4 h-4 fill-neutral-400 group-hover:fill-red-400 transition-colors" /> Stop Recording
          </Button>
        )}
        
        {isRecording && (
          <>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Button 
              onClick={() => setIsPaused(!isPaused)} 
              variant="ghost" 
              className={`h-10 px-5 rounded-xl gap-2.5 text-sm font-semibold transition-all shadow-inner border ${
                isPaused 
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20" 
                  : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"
              }`}
            >
              {isPaused ? <Play className="w-4 h-4 fill-emerald-400" /> : <Pause className="w-4 h-4 fill-blue-400" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </>
        )}

      </div>

    </div>
  );

  return (
    <>
      {!isCameraActive && (
        <Button
          onClick={startCamera}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white transition-all"
          title="Record Board (Owner Only)"
        >
          <Video className="w-4 h-4" />
        </Button>
      )}

      {isCameraActive && mounted && createPortal(floatingUI, document.body)}
    </>
  );
}