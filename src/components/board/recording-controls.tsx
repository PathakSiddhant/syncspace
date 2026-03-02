"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Video, Square, Play, Circle, X, Pause, GripHorizontal, Download, Trash2 } from "lucide-react";
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
  
  // 🔥 NEW: Video preview state
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const streamRef = useRef<MediaStream | null>(null); 
  const displayStreamRef = useRef<MediaStream | null>(null); 
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [camSize, setCamSize] = useState(160); 
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, size: 0 });

  // --- 2. CAMERA SETUP ---
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
        alert("Please allow camera and microphone access.");
      }
    }
  };

  const stopCamera = () => {
    if (isRecording) stopScreenRecording(); 
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // --- 3. THE RECORDING ENGINE ---
  const startScreenRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { displaySurface: "browser" }, 
        audio: true 
      });
      displayStreamRef.current = displayStream;

      const audioTrack = streamRef.current?.getAudioTracks()[0];
      const tracks = [...displayStream.getVideoTracks()];
      
      if (audioTrack) tracks.push(audioTrack);
      
      const combinedStream = new MediaStream(tracks);

      const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // 🔥 FIX: Direct download hataya. Ab hum URL banake State mein save karenge (Preview ke liye)
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url); // Trigger Preview Modal
        recordedChunksRef.current = [];
      };

      displayStream.getVideoTracks()[0].onended = () => {
        stopScreenRecording();
      };

      recorder.start(1000); 
      setIsRecording(true);
      setIsPaused(false);

    } catch (err) {
      console.error("Screen recording cancelled or failed:", err);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach(t => t.stop());
      displayStreamRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // 🔥 NEW: Preview Action Handlers
  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement("a");
    a.href = recordedVideoUrl;
    a.download = `SyncSpace-Session-${new Date().toISOString().slice(0,10)}.webm`;
    a.click();
    handleDiscardVideo(); // Download ke baad preview hata do
  };

  const handleDiscardVideo = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
  };

  // --- 4. EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setPos({ x: window.innerWidth - 300, y: window.innerHeight - 300 });
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

  // --- 5. DRAG & RESIZE HANDLERS ---
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.resize-handle')) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
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
    const delta = Math.max(e.clientX - resizeStart.current.x, e.clientY - resizeStart.current.y); 
    setCamSize(Math.max(120, Math.min(450, resizeStart.current.size + delta))); 
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // --- 6. RENDER ---
  if (!isOwner) return null;

  // 🔥 THE CINEMATIC PREVIEW MODAL
  const previewModal = recordedVideoUrl && (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111] border border-white/10 p-5 rounded-2xl shadow-2xl w-[80vw] max-w-4xl flex flex-col gap-4 animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between px-1">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            Review Recording
          </h3>
          <button onClick={handleDiscardVideo} className="text-neutral-400 hover:text-white transition-colors p-1.5 bg-white/5 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-full bg-black rounded-xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative shadow-inner">
          <video 
            src={recordedVideoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-1">
          <Button onClick={handleDiscardVideo} variant="ghost" className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl px-5 gap-2 transition-all">
            <Trash2 className="w-4 h-4" /> Discard
          </Button>
          <Button onClick={handleDownloadVideo} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> Save to Computer
          </Button>
        </div>

      </div>
    </div>
  );

  const floatingUI = (
    <div 
      style={{ left: pos.x, top: pos.y }}
      className={`fixed z-99999 flex flex-col items-center gap-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} animate-in fade-in zoom-in-95 duration-200`}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      
      {/* 📸 Resizable Camera Wrapper */}
      <div style={{ width: camSize, height: camSize }} className="relative group">
        <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#222] shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror-mode pointer-events-none" style={{ transform: "scaleX(-1)" }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-white/50 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <GripHorizontal className="w-5 h-5" />
        </div>
        <button onClick={stopCamera} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-xl z-50 border-2 border-[#111]" title="Close Camera">
          <X className="w-4 h-4" />
        </button>
        <div onPointerDown={handleResizeStart} onPointerMove={handleResizeMove} onPointerUp={handleResizeEnd} className="resize-handle absolute bottom-0 right-0 w-7 h-7 bg-indigo-500 hover:bg-indigo-400 rounded-full cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-50 shadow-xl border-2 border-[#111]" title="Drag to Resize">
          <div className="w-2 h-2 bg-white rounded-full pointer-events-none" />
        </div>
        
        {isRecording && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#111] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl z-50">
            <div className={`w-2.5 h-2.5 bg-red-500 rounded-full ${isPaused ? '' : 'animate-pulse'}`} />
            <span className="text-[10px] text-white font-bold tracking-widest uppercase mt-px">{isPaused ? 'PAUSED' : 'REC'}</span>
          </div>
        )}
      </div>

      {/* 🎛️ Smart Control Panel */}
      <div className="flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        {!isRecording ? (
          <Button onClick={startScreenRecording} variant="ghost" className="h-10 px-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl gap-2.5 text-sm font-semibold transition-all group">
            <Circle className="w-4 h-4 fill-red-400 group-hover:fill-red-500 transition-colors" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopScreenRecording} variant="ghost" className="h-10 px-5 bg-[#2a2a2a] hover:bg-[#333] text-neutral-200 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded-xl gap-2.5 text-sm font-semibold transition-all shadow-inner group">
            <Square className="w-4 h-4 fill-neutral-400 group-hover:fill-red-400 transition-colors" /> Stop Recording
          </Button>
        )}
        
        {isRecording && (
          <>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Button onClick={togglePause} variant="ghost" className={`h-10 px-5 rounded-xl gap-2.5 text-sm font-semibold transition-all shadow-inner border ${isPaused ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"}`}>
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
      {/* 🎛️ DOCK BUTTON */}
      {!isCameraActive && (
        <Button onClick={startCamera} variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-transparent hover:bg-white/8 text-neutral-400 hover:text-white transition-all" title="Record Board">
          <Video className="w-4 h-4" />
        </Button>
      )}

      {/* 🔥 THE MAGIC PORTALS */}
      {isCameraActive && mounted && createPortal(floatingUI, document.body)}
      {mounted && createPortal(previewModal, document.body)}
    </>
  );
}