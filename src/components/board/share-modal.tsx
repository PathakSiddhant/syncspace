"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, Globe, Lock, Loader2 } from "lucide-react";
import { updateBoardLinkAccess } from "@/lib/actions/board.actions";

interface ShareModalProps {
  boardId: string;
  boardTitle: string;
  initialLinkAccess: string;
}

export function ShareModal({ boardId, boardTitle, initialLinkAccess }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [generalAccess, setGeneralAccess] = useState(initialLinkAccess || "private");
  const [isUpdating, setIsUpdating] = useState(false);

  const onCopyLink = () => {
    const url = `${window.location.origin}/board/${boardId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAccessChange = async (newAccess: string) => {
    setGeneralAccess(newAccess);
    setIsUpdating(true);
    
    const result = await updateBoardLinkAccess(boardId, newAccess);
    if (!result.success) {
      alert("Failed to update access");
      setGeneralAccess(generalAccess);
    }
    setIsUpdating(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 px-4 transition-all shadow-sm shadow-emerald-900/20">
          <Users className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25 bg-neutral-900 border-neutral-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Share &quot;{boardTitle}&quot;</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          
          <div className="flex justify-between items-center bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-md">
                {generalAccess === "private" ? <Lock className="w-4 h-4 text-neutral-400" /> : <Globe className="w-4 h-4 text-emerald-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">General Access</p>
                <p className="text-xs text-neutral-400">
                  {generalAccess === "private" ? "Restricted" : "Anyone with link"}
                </p>
              </div>
            </div>

            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            ) : (
              <select 
                value={generalAccess}
                onChange={(e) => handleAccessChange(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-sm rounded-md px-2 py-1.5 text-white outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
              >
                <option value="private">Restricted</option>
                <option value="view">Viewer</option>
                <option value="edit">Editor</option>
                {/* Note: Tldraw doesn't have a native 'comment' mode yet, we will add that custom later! */}
              </select>
            )}
          </div>

          <Button 
            onClick={onCopyLink} 
            className={`w-full h-10 gap-2 transition-all ${isCopied ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-black hover:bg-neutral-200'}`}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? "Link Copied" : "Copy Link"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}