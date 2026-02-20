"use server";

import { db } from "@/lib/db";
import { workspaces } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createWorkspace(name: string) {
  try {
    // 1. Get the current logged-in user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("You must be logged in to create a workspace.");
    }

    // 2. Insert the new workspace into Neon DB
    const [workspace] = await db.insert(workspaces).values({
      name: name,
      ownerId: userId,
    }).returning(); // .returning() gives us back the newly created row

    // 3. Tell Next.js to refresh the dashboard page so the new workspace shows up instantly
    revalidatePath("/dashboard");
    
    return { success: true, workspace };
  } catch (error) {
    console.error("Error creating workspace:", error);
    return { success: false, error: "Failed to create workspace." };
  }
}