import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

/**
 * POST /api/razorpay/webhook
 * Verifies Razorpay webhook signature using RAZORPAY_WEBHOOK_SECRET
 * and updates order / refund states idempotently.
 */
export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, configured: false, error: 'RAZORPAY_WEBHOOK_SECRET is not configured.' },
        { status: 503 }
      );
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing webhook signature.' }, { status: 400 });
    }

    const rawBody = await req.text();
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const sigBuf = Buffer.from(expectedSignature, 'utf8');
    const providedBuf = Buffer.from(signature, 'utf8');
    if (sigBuf.length !== providedBuf.length || !crypto.timingSafeEqual(sigBuf, providedBuf)) {
      return NextResponse.json({ success: false, error: 'Invalid webhook signature.' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const paymentEntity = event?.payload?.payment?.entity;
    const refundEntity = event?.payload?.refund?.entity;

    if (event.event === 'payment.captured' && paymentEntity?.id) {
      await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'verified',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', paymentEntity.id);
    } else if (event.event === 'payment.failed' && paymentEntity?.order_id) {
      await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', paymentEntity.order_id);
    } else if (event.event === 'refund.processed' && refundEntity?.payment_id) {
      await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', refundEntity.payment_id);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook processing error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
