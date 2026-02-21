"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Users, Globe, ShieldAlert } from "lucide-react";

interface ShareModalProps {
  boardId: string;
  boardTitle: string;
}

export function ShareModal({ boardId, boardTitle }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailPermission, setEmailPermission] = useState("edit");
  const [linkPermission, setLinkPermission] = useState("view"); // 🔥 New state for link

  const onCopyLink = () => {
    const url = `${window.location.origin}/board/${boardId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const onInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert(`Invite sent to ${email} with ${emailPermission} access! (DB integration coming soon)`);
    setEmail("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 px-4 transition-all shadow-sm shadow-emerald-900/20">
          <Users className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-112.5 bg-neutral-900 border-neutral-800 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            Share &quot;{boardTitle}&quot;
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          
          {/* Section 1: Email Invite */}
          <div className="space-y-3">
            <Label className="text-neutral-300 font-medium text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              Invite specific people
            </Label>
            <form onSubmit={onInvite} className="flex gap-2">
              <Input
                placeholder="Email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500 h-10"
                type="email"
              />
              <select 
                value={emailPermission}
                onChange={(e) => setEmailPermission(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-sm rounded-md px-3 text-white outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="edit">Can edit</option>
                <option value="view">Can view</option>
              </select>
              <Button type="submit" className="bg-white text-black hover:bg-neutral-200 h-10">
                Invite
              </Button>
            </form>
          </div>

          <div className="h-px w-full bg-neutral-800"></div>

          {/* Section 2: Copy Link with Permissions */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-neutral-300 font-medium text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                Anyone with the link
              </Label>
              {/* 🔥 Link Permission Toggle */}
              <select 
                value={linkPermission}
                onChange={(e) => setLinkPermission(e.target.value)}
                className="bg-transparent border-none text-sm text-emerald-400 outline-none cursor-pointer hover:text-emerald-300 transition-colors text-right"
              >
                <option value="view" className="bg-neutral-900">Can view</option>
                <option value="edit" className="bg-neutral-900">Can edit</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-2 bg-neutral-800/50 border border-neutral-800 rounded-md">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/board/${boardId}`}
                className="bg-transparent border-0 focus-visible:ring-0 text-neutral-400 h-8 font-mono text-xs"
              />
              <Button 
                onClick={onCopyLink} 
                variant="outline" 
                className={`h-8 px-3 gap-2 border-neutral-700 hover:text-white transition-all ${isCopied ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
            
            {/* Host Controls Teaser */}
            <div className="mt-4 p-3 bg-neutral-800/30 border border-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-400 leading-relaxed">
                <strong className="text-white">Host Controls:</strong> As the owner, you will be able to manage active users, update their display names, and revoke edit access mid-session from the dashboard.
              </p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}