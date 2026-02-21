import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

// Initialize Liveblocks with your secret key from .env.local
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  // 1. Get the current logged-in user from Clerk
  const user = await currentUser();
  const { room } = await request.json();

  if (!user) {
    return new Response("Unauthorized: You must be logged in", { status: 403 });
  }

  // 2. Create a secure session for this specific user
  // Hum unka naam aur photo bhi bhej rahe hain taaki cursor pe unki profile dikhe!
  const session = liveblocks.prepareSession(
    user.id,
    { 
      userInfo: { 
        name: user.firstName || "Zyncro User", 
        picture: user.imageUrl 
      } 
    }
  );

  // 3. Give this user full access to the requested room
  session.allow(room, session.FULL_ACCESS);

  // 4. Authorize and return the token to the frontend
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}