"use server";

import { db } from "@/lib/db";
import { boards, workspaces } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBoard(title: string, workspaceId: string) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: Please log in.");

    // 2. Security Check: Verify the workspace actually belongs to this user
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    if (!workspace || workspace.ownerId !== userId) {
      throw new Error("Unauthorized: You do not own this workspace.");
    }

    // 3. Create the Board
    const [board] = await db.insert(boards).values({
      title: title,
      workspaceId: workspaceId,
      creatorId: userId,
    }).returning(); // Return the new data so we know the new board's ID

    // 4. Refresh the workspace page in the background
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    
    // 5. Return success and the new board ID for redirection
    return { success: true, boardId: board.id };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Failed to create board" };
  }
}