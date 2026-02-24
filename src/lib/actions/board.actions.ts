"use server";

import { db } from "@/lib/db";
import { boards, workspaces } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Create a new board
export async function createBoard(title: string, workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: Please log in.");

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    if (!workspace || workspace.ownerId !== userId) {
      throw new Error("Unauthorized: You do not own this workspace.");
    }

    const [board] = await db.insert(boards).values({
      title: title,
      workspaceId: workspaceId,
      creatorId: userId,
    }).returning(); 

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    
    return { success: true, boardId: board.id };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Failed to create board" };
  }
}

// 🔥 2. NEW FUNCTION: Update the public link access of a board
export async function updateBoardLinkAccess(boardId: string, linkAccess: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Security: Only owner can change link sharing settings
    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board || board.creatorId !== userId) {
      throw new Error("Only the owner can update link permissions");
    }

    await db.update(boards).set({ linkAccess }).where(eq(boards.id, boardId));
    revalidatePath(`/board/${boardId}`);
    
    return { success: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update access" 
    };
  }
}

// 🔥 3. RENAME BOARD
export async function renameBoard(boardId: string, workspaceId: string, newTitle: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board || board.creatorId !== userId) {
      throw new Error("Only the owner can rename this board");
    }

    await db.update(boards).set({ title: newTitle }).where(eq(boards.id, boardId));
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to rename" };
  }
}

// 🔥 4. DELETE BOARD
export async function deleteBoard(boardId: string, workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
    if (!board || board.creatorId !== userId) {
      throw new Error("Only the owner can delete this board");
    }

    // Delete the board (Neon DB will also auto-delete collaborators because of cascade!)
    await db.delete(boards).where(eq(boards.id, boardId));
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete" };
  }
}