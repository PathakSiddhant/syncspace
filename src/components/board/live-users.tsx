"use client";

import { useOthers, useSelf, useBroadcastEvent } from "@liveblocks/react/suspense";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addCollaborator } from "@/lib/actions/collaborator.actions";
import { Eye, PenTool, Loader2, Navigation } from "lucide-react";

interface LiveUsersProps {
  boardId: string;
  isOwner: boolean;
}

interface UserInfo {
  name?: string;
  email?: string;
  picture?: string;
}

export function LiveUsers({ boardId, isOwner }: LiveUsersProps) {
  const others = useOthers();
  const currentUser = useSelf();
  const broadcast = useBroadcastEvent();
  
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const hasMoreUsers = others.length > 3;
  const visibleUsers = others.slice(0, 3);

  // Switch roles mid-meeting
  const handleRoleChange = async (email: string, newRole: "view" | "edit") => {
    if (!email) return;
    setLoadingEmail(email);
    await addCollaborator(boardId, email, newRole);
    broadcast({ type: "ROLE_CHANGE", email: email, newRole: newRole });
    setLoadingEmail(null);
  };

  // 🔥 THE VIEWPORT JUMP LOGIC
  const handleGoToUser = (targetEmail: string) => {
    const myEmail = currentUser.info?.email;
    if (!targetEmail || !myEmail) return;
    // Broadcast a request: "Hey target, where are you looking?"
    broadcast({ type: "GOTO_REQUEST", targetEmail: targetEmail, requesterEmail: myEmail });
  };

  const myInfo = currentUser.info as UserInfo | undefined;

  return (
    <div className="flex items-center gap-1">
      {/* You */}
      <div className="relative group flex items-center justify-center h-8 w-8 rounded-full border-2 border-emerald-500 bg-neutral-800 shrink-0 overflow-hidden shadow-sm z-10">
        {myInfo?.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={myInfo.picture} alt="You" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-semibold text-white">You</span>
        )}
      </div>

      {/* Others */}
      {visibleUsers.map(({ connectionId, info }) => {
        const userInfo = info as UserInfo; 
        
        return (
          <Popover key={connectionId}>
            <PopoverTrigger asChild>
              <div 
                className={`relative group flex items-center justify-center h-8 w-8 rounded-full border-2 border-neutral-900 bg-neutral-700 shrink-0 overflow-hidden -ml-3 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer hover:border-emerald-500 z-20`}
                title={userInfo?.name || "Anonymous"}
              >
                {userInfo?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userInfo.picture} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-white">
                    {userInfo?.name?.charAt(0) || "U"}
                  </span>
                )}
                
                {loadingEmail === userInfo?.email && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                )}
              </div>
            </PopoverTrigger>
            
            <PopoverContent 
              sideOffset={8}
              className="w-48 p-1.5 bg-neutral-900 border-neutral-800 shadow-2xl rounded-lg z-99999 relative"
            >
              <div className="px-2 py-1.5 border-b border-neutral-800 mb-1 flex justify-between items-start">
                <div className="overflow-hidden pr-2">
                  <p className="text-xs font-semibold text-white truncate">{userInfo.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{userInfo.email}</p>
                </div>
              </div>

              {/* 🔥 THE "GO TO USER" BUTTON */}
              {userInfo?.email && (
                <button 
                  onClick={() => handleGoToUser(userInfo.email as string)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left mb-1 text-neutral-300 hover:text-white hover:bg-neutral-800"
                >
                  <Navigation className="w-3.5 h-3.5" /> Go to User
                </button>
              )}
              
              {/* OWNER CONTROLS */}
              {isOwner && userInfo?.email && (
                <>
                  <div className="h-px bg-neutral-800 w-full my-1"></div>
                  <button 
                    onClick={() => handleRoleChange(userInfo.email as string, "edit")}
                    disabled={loadingEmail === userInfo.email}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors text-left"
                  >
                    <PenTool className="w-3.5 h-3.5" /> Make Editor
                  </button>
                  <button 
                    onClick={() => handleRoleChange(userInfo.email as string, "view")}
                    disabled={loadingEmail === userInfo.email}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors text-left"
                  >
                    <Eye className="w-3.5 h-3.5" /> Make Viewer
                  </button>
                </>
              )}
            </PopoverContent>
          </Popover>
        );
      })}

      {hasMoreUsers && (
        <div className="relative flex items-center justify-center h-8 w-8 rounded-full border-2 border-neutral-900 bg-neutral-800 shrink-0 -ml-3 z-30">
          <span className="text-xs font-medium text-white">+{others.length - 3}</span>
        </div>
      )}
    </div>
  );
}