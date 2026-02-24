"use server";

import { db } from "@/lib/db";
import { workspaces } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 🔥 1. CREATE WORKSPACE (The missing engine!)
export async function createWorkspace(name: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [workspace] = await db.insert(workspaces).values({
      name: name,
      ownerId: userId,
    }).returning();

    revalidatePath("/dashboard");
    
    return { success: true, workspaceId: workspace.id };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create workspace" };
  }
}

// 🔥 2. RENAME WORKSPACE
export async function renameWorkspace(workspaceId: string, newName: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!workspace || workspace.ownerId !== userId) {
      throw new Error("Only the owner can rename this workspace");
    }

    await db.update(workspaces).set({ name: newName }).where(eq(workspaces.id, workspaceId));
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    revalidatePath(`/dashboard`); // Update sidebar too
    
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to rename" };
  }
}

// 🔥 3. DELETE WORKSPACE
export async function deleteWorkspace(workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!workspace || workspace.ownerId !== userId) {
      throw new Error("Only the owner can delete this workspace");
    }

    // Cascade delete in DB handles removing all boards automatically
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
    revalidatePath(`/dashboard`);
    
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete" };
  }
}