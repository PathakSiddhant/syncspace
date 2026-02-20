import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> Choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

// Get the headers
  const headerPayload = await headers(); // <-- Yahan await lagana tha!
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;

  // Sync: When a user is created in Clerk, add them to our Neon DB
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    if (email) {
      await db.insert(users).values({
        id: id,
        email: email,
        name: name || 'Zyncro User',
        imageUrl: image_url,
      });
      console.log(`[Webhook] User ${id} successfully inserted into Neon DB!`);
    }
  }

  // Sync: When a user deletes their account, remove them from Neon DB
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      await db.delete(users).where(eq(users.id, id));
      console.log(`[Webhook] User ${id} deleted from Neon DB!`);
    }
  }

  return new Response('', { status: 200 })
}