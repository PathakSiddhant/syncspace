"use server";

import { db } from "@/lib/db";
import { follows } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function toggleFollow(followingEmail: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.followingEmail, followingEmail)));

    if (existing.length > 0) {
      await db.delete(follows).where(eq(follows.id, existing[0].id));
      return { success: true, isFollowing: false };
    } else {
      await db.insert(follows).values({ followerId: userId, followingEmail });
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

// Fetch all people the current user is following
export async function getFollowedEmails() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const records = await db
      .select({ email: follows.followingEmail })
      .from(follows)
      .where(eq(follows.followerId, userId));

    return records.map((r) => r.email);
  } catch (error) {
    return [];
  }
}