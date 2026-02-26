import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    // 1. Get the current logged-in user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the room name from the URL (e.g., ?room=board-123)
    const url = new URL(req.url);
    const room = url.searchParams.get("room");

    if (!room) {
      return NextResponse.json({ error: "Missing 'room' query parameter" }, { status: 400 });
    }

    // 3. Set up user details for the Huddle
    const participantName = user.firstName 
      ? `${user.firstName} ${user.lastName || ''}`.trim() 
      : "Anonymous Guest";

    // 4. Create the LiveKit Token (Entry Ticket)
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: user.id,
        name: participantName,
      }
    );

    // 5. Grant permissions to this user (can join room, can publish audio)
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    // 6. Send the token back to the frontend
    return NextResponse.json({ token: await at.toJwt() });

  } catch (error) {
    console.error("LiveKit Token Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}