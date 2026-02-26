"use client";

import { useState, useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer, useParticipants, useLocalParticipant, useConnectionState } from "@livekit/components-react";
import { Mic, MicOff, Users, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoiceHuddle({ boardId }: { boardId: string }) {
  const [token, setToken] = useState<string | null>(null);

  // 🚀 Fetch Token on Load
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/livekit?room=${boardId}`);
        const data = await res.json();
        if (data.token) setToken(data.token);
      } catch (e) {
        console.error("LiveKit fetch error:", e);
      }
    };
    fetchToken();
  }, [boardId]);

  if (!token) {
    return (
      <Button variant="ghost" className="h-9 px-3 rounded-md text-neutral-500 cursor-not-allowed">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-[12px] ml-2 font-medium">Connecting...</span>
      </Button>
    );
  }

  return (
    // 🔥 connect={true} automatically joins the room. audio={false} keeps mic muted initially!
    <LiveKitRoom
      video={false}
      audio={false} 
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      options={{ adaptiveStream: true }}
    >
      <HuddleControls />
      {/* 🎧 Ye humein doosro ki aawaz sunne mein madad karta hai */}
      <RoomAudioRenderer /> 
    </LiveKitRoom>
  );
}

// 🎛️ THE DIRECT TASKBAR CONTROLS (UI FIXES APPLIED)
function HuddleControls() {
  // Check if connection is 100% ready
  const connectionState = useConnectionState();
  const isConnected = connectionState === "connected";

  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [showParticipants, setShowParticipants] = useState(false);

  // Instant UI State Management
  const [isMicOn, setIsMicOn] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Keep local state in sync with hardware
  useEffect(() => {
    if (localParticipant) {
      setIsMicOn(localParticipant.isMicrophoneEnabled);
    }
  }, [localParticipant?.isMicrophoneEnabled, localParticipant]);

  const toggleMic = async () => {
    // Agar connect nahi hua ya processing chal rahi hai, toh click ignore karo! (FIXES TIMEOUT ERROR)
    if (!localParticipant || !isConnected || isPending) return;

    setIsPending(true);
    try {
      if (isMicOn) {
        await localParticipant.setMicrophoneEnabled(false);
        setIsMicOn(false); // Instant Red
      } else {
        await localParticipant.setMicrophoneEnabled(true);
        setIsMicOn(true); // Instant Green
      }
    } catch (e) {
      console.error("Mic toggle failed:", e);
      alert("Please allow microphone access in your browser settings!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1.5">
      
      {/* 1. THE MAIN MIC BUTTON */}
      <Button
        onClick={toggleMic}
        variant="ghost"
        disabled={!isConnected || isPending}
        className={`h-9 px-3 rounded-md transition-all flex items-center gap-2 ${
          !isConnected 
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" // Gray if not connected
            : isPending 
            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" // Yellow when loading
            : isMicOn 
            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]" // Green when LIVE
            : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" // Red when MUTED
        }`}
      >
        {!isConnected || isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isMicOn ? (
          <Mic className="w-4 h-4" />
        ) : (
          <MicOff className="w-4 h-4" />
        )}
        <span className="text-[12px] font-bold tracking-wide">
          {!isConnected ? "Joining..." : isPending ? "Wait..." : isMicOn ? "Live" : "Muted"}
        </span>
      </Button>

      {/* 2. PARTICIPANTS LIST BUTTON */}
      <Button
        onClick={() => setShowParticipants(!showParticipants)}
        variant="ghost"
        className={`h-9 px-2.5 rounded-md transition-all flex items-center gap-1.5 ${
          showParticipants ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/8 hover:text-white"
        }`}
        title="See who is speaking"
      >
        <Users className="w-4 h-4" />
        <span className="text-[11px] font-bold">{participants.length}</span>
      </Button>

      {/* 3. THE "WHO IS SPEAKING" PANEL (Redesigned for clarity) */}
      {showParticipants && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] bg-[#111111]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-[99999]">
          <div className="p-3 border-b border-white/10 bg-white/[0.03]">
            <h3 className="text-[12px] font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Active Call ({participants.length})
            </h3>
          </div>
          <div className="p-2 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
            {participants.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-4">Waiting for others...</p>
            ) : (
              participants.map((p) => {
                const isSpeaking = p.isSpeaking;
                const micOn = p.isMicrophoneEnabled;
                const isMe = p.isLocal;

                return (
                  <div key={p.identity} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isSpeaking ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                    
                    {/* Glowing Avatar */}
                    <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all ${
                      isSpeaking ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-white/10'
                    }`}>
                      {p.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                      {/* Speaker Dot */}
                      {isSpeaking && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#111]"></span>
                        </span>
                      )}
                    </div>

                    {/* Name & Status Indicator */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className={`text-xs font-semibold truncate ${isSpeaking ? 'text-emerald-400' : 'text-neutral-200'}`}>
                        {p.name?.split(' ')[0]} {isMe && "(You)"}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {isSpeaking ? "Speaking..." : micOn ? "Listening" : "Muted"}
                      </span>
                    </div>

                    {/* Mic Icon for each user */}
                    {micOn ? (
                      <Mic className={`w-4 h-4 ${isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-neutral-400'}`} />
                    ) : (
                      <MicOff className="w-4 h-4 text-red-400/60" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}