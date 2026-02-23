"use server";

import { db } from "@/lib/db";
import { boards, collaborators } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCollaborator(boardId: string, email: string, accessType: string) {
  try {
    // 1. Verify Authentication
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: Please log in.");

    // 2. Verify Ownership (Sirf Board ka owner hi invite bhej sakta hai)
    const [board] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, boardId));

    if (!board || board.creatorId !== userId) {
      throw new Error("Unauthorized: Only the board owner can invite collaborators.");
    }

    // 3. Check if collaborator already exists (taaki duplicate na ho)
    const [existingCollab] = await db
      .select()
      .from(collaborators)
      .where(
        and(
          eq(collaborators.boardId, boardId),
          eq(collaborators.email, email)
        )
      );

    if (existingCollab) {
      // Agar pehle se hai, toh bas uski permission update kar do (e.g. view se edit)
      await db
        .update(collaborators)
        .set({ accessType })
        .where(eq(collaborators.id, existingCollab.id));
    } else {
      // Naya collaborator insert karo
      await db.insert(collaborators).values({
        boardId,
        email,
        accessType,
      });
    }

    // 4. Refresh the page in background
    revalidatePath(`/board/${boardId}`);
    
    return { success: true, message: `Successfully added ${email}` };
  } catch (error: any) {
    console.error("Error adding collaborator:", error);
    return { success: false, error: error.message || "Failed to add collaborator" };
  }
}