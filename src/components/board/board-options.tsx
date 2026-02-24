"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Edit2, Loader2, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBoard, renameBoard } from "@/lib/actions/board.actions";

interface BoardOptionsProps {
  boardId: string;
  workspaceId: string;
  currentTitle: string;
}

export function BoardOptions({ boardId, workspaceId, currentTitle }: BoardOptionsProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [renameInput, setRenameInput] = useState(currentTitle);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!renameInput.trim() || renameInput === currentTitle) return setIsRenameOpen(false);
    
    setIsLoading(true);
    await renameBoard(boardId, workspaceId, renameInput.trim());
    setIsLoading(false);
    setIsRenameOpen(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleteConfirm !== currentTitle) return;
    
    setIsLoading(true);
    await deleteBoard(boardId, workspaceId);
    setIsLoading(false);
    setIsDeleteOpen(false);
  };

  return (
    // 🔥 THE SHIELD: Ye div kisi bhi click ya keypress ko Link tak nahi jaane dega!
    <div 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* 1. THE DROPDOWN MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-neutral-900 border-neutral-800 text-neutral-300 shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Shield here too
        >
          <DropdownMenuItem 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsRenameOpen(true); }}
            className="cursor-pointer focus:bg-neutral-800 focus:text-white transition-colors"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsDeleteOpen(true); }}
            className="cursor-pointer focus:bg-red-500/10 focus:text-red-500 transition-colors"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Board</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 2. THE RENAME DIALOG */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent 
          className="sm:max-w-106.25 bg-neutral-900 border-neutral-800 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
            <DialogDescription className="text-neutral-400">Enter a new name for your canvas.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename} className="space-y-4 py-2">
            <Input
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500"
              autoFocus
              disabled={isLoading}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsRenameOpen(false)} disabled={isLoading} className="hover:bg-neutral-800 text-neutral-300">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !renameInput.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white w-24">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. THE GITHUB-STYLE DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); setDeleteConfirm(""); }}>
        <DialogContent 
          className="sm:max-w-106.25 bg-neutral-900 border-red-900/30 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </DialogTitle>
            <DialogDescription className="text-neutral-400 mt-2 leading-relaxed">
              This action cannot be undone. This will permanently delete the board <strong className="text-white">&quot;{currentTitle}&quot;</strong> and remove all collaborators.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDelete} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-neutral-300">
                Please type <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded select-all">{currentTitle}</span> to confirm.
              </Label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-red-500"
                placeholder={currentTitle}
                disabled={isLoading}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isLoading} className="hover:bg-neutral-800 text-neutral-300">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || deleteConfirm !== currentTitle} 
                className="bg-red-600 hover:bg-red-700 text-white w-24 disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}