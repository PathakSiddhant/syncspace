"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { createBoard } from "@/lib/actions/board.actions";
import { useRouter } from "next/navigation";

interface CreateBoardModalProps {
  workspaceId: string;
  children?: React.ReactNode; // Allows us to use custom trigger buttons
}

export function CreateBoardModal({ workspaceId, children }: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createBoard(title, workspaceId);

    if (result.success && result.boardId) {
      setOpen(false);
      setTitle("");
      // 🔥 MAGIC: Redirect straight to the new canvas!
      router.push(`/board/${result.boardId}`);
    } else {
      console.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* If a custom button is passed, use it. Otherwise, use the default button. */}
        {children || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all">
            <PlusCircle className="w-4 h-4" />
            New Board
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25 bg-neutral-900 border-neutral-800 text-white shadow-2xl shadow-emerald-900/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Create Canvas Board</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Give your new board a title. You will be redirected to the canvas immediately.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-neutral-300 font-medium">Board Title</Label>
            <Input
              id="title"
              placeholder="e.g. MVP Wireframes, DB Schema"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
              required
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !title.trim()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Preparing Canvas..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}