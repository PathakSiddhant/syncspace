"use client";

import { useState, useRef, useEffect } from "react";
import { useStorage, useMutation, useSelf } from "@liveblocks/react/suspense";
import { MessageSquare, X, Send, Paperclip, Image as ImageIcon, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveList } from "@liveblocks/client";
import { Rnd } from "react-rnd";

type ChatMessage = {
  id: string;
  text: string;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  timestamp: number;
  type: "text" | "image" | "file"; 
  fileUrl?: string;
  fileName?: string; 
};

interface UserInfo {
  name?: string;
  email?: string;
  picture?: string;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const MAX_WIDTH = 400; 
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.5));
      };
    };
  });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 🔥 FIX: The Smart URL Parser (Now detects www. and http/https)
const renderMessageText = (text: string) => {
  // Matches either http://, https://, OR www. followed by non-space characters
  const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      // Agar link 'www.' se shuru hoti hai, toh internally 'https://' laga do taaki link toote na
      const href = part.startsWith("www.") ? `https://${part}` : part;
      return (
        <a 
          key={i} 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 340, height: 480 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mouseStartPos = useRef({ x: 0, y: 0 });

  const currentUser = useSelf();
  const messages = useStorage((root) => root.messages) as ChatMessage[];

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
    
    setPosition({
      x: window.innerWidth - 100, 
      y: window.innerHeight - 140, 
    });
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timeout);
    }
  }, [isOpen, messages?.length]);

  const addMessage = useMutation(({ storage }, newMessage: ChatMessage) => {
    const liveMessages = storage.get("messages") as LiveList<ChatMessage>;
    if (liveMessages) {
      liveMessages.push(newMessage);
    }
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() || !currentUser.info) return;
    const myInfo = currentUser.info as UserInfo;
    addMessage({
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      senderName: myInfo?.name || "Anonymous",
      senderEmail: myInfo?.email || "",
      senderAvatar: myInfo?.picture || "",
      timestamp: Date.now(),
      type: "text",
    });
    setInputValue("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser.info) return;

    if (file.size > 300 * 1024) {
      alert("File is too heavy for real-time sync. Keep it under 300KB!");
      return;
    }

    const myInfo = currentUser.info as UserInfo;
    let fileDataUrl: string;
    let msgType: "image" | "file";

    if (file.type.startsWith("image/")) {
      fileDataUrl = await compressImage(file);
      msgType = "image";
    } else {
      fileDataUrl = await fileToBase64(file);
      msgType = "file";
    }

    addMessage({
      id: crypto.randomUUID(),
      text: file.name,
      senderName: myInfo?.name || "Anonymous",
      senderEmail: myInfo?.email || "",
      senderAvatar: myInfo?.picture || "",
      timestamp: Date.now(),
      type: msgType,
      fileUrl: fileDataUrl,
      fileName: file.name,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChat = () => {
    setPosition((prev) => ({
      x: prev.x - (size.width - 56),
      y: prev.y - (size.height - 56),
    }));
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setPosition((prev) => ({
      x: prev.x + (size.width - 56),
      y: prev.y + (size.height - 56),
    }));
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSend();       
    }
  };

  if (!isMounted) return null;

  return (
    <Rnd
      position={position}
      size={isOpen ? size : { width: 56, height: 56 }}
      minWidth={isOpen ? 280 : 56}
      minHeight={isOpen ? 300 : 56}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        if (isOpen) {
          setSize({ width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
          setPosition(pos); 
        }
      }}
      enableResizing={isOpen ? { top: true, right: true, left: true, bottom: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true } : false}
      // 🔥 FIX: 'bounds="window"' hata diya! Ab tera chat kahin bhi, kaise bhi drag ho sakta hai!
      dragHandleClassName="chat-drag-handle"
      style={{ position: "fixed", zIndex: 99999 }}
    >
      {isOpen ? (
        <div className="w-full h-full flex flex-col bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="chat-drag-handle h-12 border-b border-neutral-700/50 bg-neutral-900/80 flex items-center justify-between px-4 shrink-0 cursor-grab active:cursor-grabbing">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 pointer-events-none">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> Team Chat
            </h3>
            <button 
              onClick={handleCloseChat} 
              className="text-neutral-400 hover:text-white p-1 hover:bg-neutral-800 rounded transition-colors" 
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map((msg) => {
                const isMe = msg.senderEmail === (currentUser.info as UserInfo | undefined)?.email;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && <span className="text-[10px] text-neutral-400 mb-1 ml-1">{msg.senderName}</span>}
                    <div className={`max-w-[85%] rounded-lg text-sm overflow-hidden shadow-sm ${isMe ? "bg-emerald-600 text-white rounded-br-none" : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700"}`}>
                      
                      {msg.type === "text" && (
                        <div className="px-3 py-2 whitespace-pre-wrap wrap-break-word">
                          {renderMessageText(msg.text)}
                        </div>
                      )}
                      
                      {msg.type === "image" && msg.fileUrl && (
                        <div className="p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={msg.fileUrl} alt="media" className="max-w-full rounded bg-neutral-950/50 object-contain" style={{ maxHeight: "200px" }} />
                          <GenericFileFooter msg={msg} />
                        </div>
                      )}
                      {msg.type === "file" && msg.fileUrl && (
                        <div className="p-2 flex items-center gap-3 bg-black/20 m-1 rounded">
                           <FileText className="w-6 h-6 opacity-70 shrink-0" />
                           <div className="overflow-hidden">
                                <p className="truncate text-xs font-medium">{msg.fileName || "File"}</p>
                                <GenericFileFooter msg={msg} compact />
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-neutral-900/80 border-t border-neutral-700/50 flex items-end gap-2 shrink-0">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-neutral-400 hover:text-white shrink-0 h-9 w-9 mb-0.5">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <textarea 
              placeholder="Type a message..." 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 bg-neutral-950/50 border border-neutral-700 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-500 resize-none min-h-10 max-h-30 scrollbar-thin scrollbar-thumb-neutral-700" 
            />
            
            <Button onClick={handleSend} disabled={!inputValue.trim()} size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-9 w-9 mb-0.5">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="chat-drag-handle w-14 h-14 rounded-full shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
          onMouseDown={(e) => { mouseStartPos.current = { x: e.clientX, y: e.clientY }; }}
          onMouseUp={(e) => {
            const dx = Math.abs(e.clientX - mouseStartPos.current.x);
            const dy = Math.abs(e.clientY - mouseStartPos.current.y);
            if (dx < 5 && dy < 5) handleOpenChat(); 
          }}
        >
          <MessageSquare className="w-6 h-6 pointer-events-none" />
          {messages?.length > 0 && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-neutral-950 rounded-full animate-pulse pointer-events-none"></span>}
        </div>
      )}
    </Rnd>
  );
}

function GenericFileFooter({ msg, compact = false }: { msg: ChatMessage, compact?: boolean }) {
    if (!msg.fileUrl) return null;
    return (
        <div className={`flex justify-between items-center ${compact ? 'mt-0.5' : 'px-2 py-1.5 bg-black/20 mt-1 rounded'}`}>
        {!compact && <span className="text-[10px] opacity-70 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</span>}
        <a href={msg.fileUrl} download={msg.fileName || "download"} className="text-[10px] hover:text-emerald-300 flex items-center gap-1 transition-colors ml-auto">
          <Download className="w-3 h-3" /> Save
        </a>
      </div>
    )
}