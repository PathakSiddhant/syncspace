"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Edit2, Loader2, AlertTriangle, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renameWorkspace, deleteWorkspace } from "@/lib/actions/workspace.actions";
import { useRouter } from "next/navigation";

interface WorkspaceOptionsProps {
  workspaceId: string;
  currentName: string;
}

export function WorkspaceOptions({ workspaceId, currentName }: WorkspaceOptionsProps) {
  const router = useRouter();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [renameInput, setRenameInput] = useState(currentName);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameInput.trim() || renameInput === currentName) return setIsRenameOpen(false);
    
    setIsLoading(true);
    await renameWorkspace(workspaceId, renameInput.trim());
    setIsLoading(false);
    setIsRenameOpen(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== currentName) return;
    
    setIsLoading(true);
    const result = await deleteWorkspace(workspaceId);
    if (result.success) {
      router.push("/dashboard"); // Redirect to home after deleting!
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800 ml-2">
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-neutral-900 border-neutral-800 text-neutral-300 shadow-2xl">
          <DropdownMenuItem onClick={() => setIsRenameOpen(true)} className="cursor-pointer focus:bg-neutral-800 focus:text-white">
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Rename Workspace</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer focus:bg-red-500/10 focus:text-red-500">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* RENAME DIALOG */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-106.25 bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader><DialogTitle>Rename Workspace</DialogTitle></DialogHeader>
          <form onSubmit={handleRename} className="space-y-4">
            <Input value={renameInput} onChange={(e) => setRenameInput(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500" autoFocus disabled={isLoading} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsRenameOpen(false)} disabled={isLoading} className="text-neutral-300 hover:bg-neutral-800">Cancel</Button>
              <Button type="submit" disabled={isLoading || !renameInput.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); setDeleteConfirm(""); }}>
        <DialogContent className="sm:max-w-106.25 bg-neutral-900 border-red-900/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500"><AlertTriangle className="h-5 w-5" /> Danger Zone</DialogTitle>
            <DialogDescription className="text-neutral-400 mt-2">Permanently delete workspace <strong className="text-white">&quot;{currentName}&quot;</strong> and ALL its boards.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDelete} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Type <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded select-all">{currentName}</span> to confirm.</Label>
              <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-red-500" placeholder={currentName} disabled={isLoading} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isLoading} className="text-neutral-300 hover:bg-neutral-800">Cancel</Button>
              <Button type="submit" disabled={isLoading || deleteConfirm !== currentName} className="bg-red-600 hover:bg-red-700 text-white disabled:bg-neutral-800 disabled:text-neutral-500">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}