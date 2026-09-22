import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-08-26.dahlia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret as string);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract metadata injected during checkout session creation
    const email = session.customer_details?.email;
    const businessName = session.metadata?.businessName || 'New Workspace';
    const stripeCustomerId = session.customer as string;

    if (!email) {
      return NextResponse.json({ error: 'No email found in session.' }, { status: 400 });
    }

    try {
      // 1. Generate secure random password for initial login
      const initialPassword = crypto.randomBytes(12).toString('hex');
      const passwordHash = await bcrypt.hash(initialPassword, 10);

      // 2. Create User and Assign ADMIN role
      const user = await prisma.user.create({
        data: {
          email: email,
          username: email.split('@')[0] + Math.floor(Math.random() * 10000),
          passwordHash: passwordHash,
          role: 'ADMIN',
          firstName: 'New Subscriber',
          stripeCustomerId: stripeCustomerId,
        }
      });

      // 3. Provision Isolated Workspace
      await prisma.workspace.create({
        data: {
          name: businessName,
          ownerId: user.id
        }
      });

      // 4. Dispatch Welcome Email (Mocked here for the UI/UX)
      console.log(`[EMAIL DISPATCH] To: ${email}`);
      console.log(`[EMAIL DISPATCH] Subject: Welcome to Family Legacy OS`);
      console.log(`[EMAIL DISPATCH] Body: Your workspace "${businessName}" is provisioned. Login at /login with password: ${initialPassword}`);

    } catch (err) {
      console.error('[PROVISIONING_ERROR]', err);
      // If user already exists or unique constraint fails, handle gracefully
      return NextResponse.json({ error: 'Provisioning failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
