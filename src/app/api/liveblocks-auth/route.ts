import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { db } from "@/lib/db";
import { boards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const user = await currentUser();
  const { room } = await request.json();

  if (!user) {
    return new Response("Unauthorized", { status: 403 });
  }

  // 1. Fetch Board
  const [board] = await db.select().from(boards).where(eq(boards.id, room));
  if (!board) {
    return new Response("Board not found", { status: 404 });
  }

  const isOwner = board.creatorId === user.id;

  // 2. Prepare Liveblocks Session (With Email payload for our role switching logic)
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.firstName || "Zyncro User",
      picture: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // 🔥 3. THE CHAT FIX: 
  // Viewers ko chat allow karne ke liye unhe storage access dena padega.
  // Drawing lock ab 100% hamare React frontend guard par dependent hai.
  if (isOwner || board.linkAccess === "edit" || board.linkAccess === "view") {
    session.allow(room, session.FULL_ACCESS);
  } else {
    // If it's set to "private" and they aren't the owner
    return new Response("Unauthorized: Forbidden: You do not have access to this board", { status: 403 });
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}