"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { createWorkspace } from "@/lib/actions/workspace.actions";
import { useRouter } from "next/navigation";

export function CreateWorkspaceModal() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Call our Server Action directly!
    const result = await createWorkspace(name);

    if (result.success) {
      setOpen(false); // Close the modal
      setName("");    // Reset the input
      // Hum baad mein user ko naye workspace ke page par redirect bhi kar sakte hain
    } else {
      console.error(result.error);
      // Ideally we would show a toast notification here (we will add Sonner toast later)
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all">
          <PlusCircle className="w-4 h-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      
      {/* Premium Dark Mode Modal Content */}
      <DialogContent className="sm:max-w-106.25 bg-neutral-900 border-neutral-800 text-white shadow-2xl shadow-emerald-900/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Create Workspace</DialogTitle>
          <DialogDescription className="text-neutral-400">
            A workspace is your team&apos;s home. You can create multiple boards inside a workspace.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-neutral-300 font-medium">Workspace Name</Label>
            <Input
              id="name"
              placeholder="e.g. Design Team, Startup Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
              required
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Creating Engine..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}