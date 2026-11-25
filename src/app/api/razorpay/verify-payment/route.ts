import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzqpsxtjfgkmqsxrtlgx.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_5lDEIb-SirWekMpfsr8xaw_5hbj5z_X';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * POST /api/razorpay/verify-payment
 * Verifies Razorpay HMAC-SHA256 payment signature on the server,
 * enforces idempotency on razorpay_payment_id, and updates Supabase orders/profiles.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency = 'INR',
      customer,
      package_label,
      order_type = 'card_purchase',
      user_id,
      profile_id,
      username,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || '';
    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: 'RAZORPAY_KEY_SECRET is not configured on the server. Payment cannot be cryptographically verified.',
        },
        { status: 503 }
      );
    }

    // Cryptographic HMAC-SHA256 signature verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const sigBuf = Buffer.from(generatedSignature, 'utf8');
    const providedBuf = Buffer.from(String(razorpay_signature), 'utf8');
    const isVerified =
      sigBuf.length === providedBuf.length && crypto.timingSafeEqual(sigBuf, providedBuf);

    if (!isVerified) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed.' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Idempotency check: prevent duplicate order creation for the same payment ID
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, status')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        verified: true,
        idempotent: true,
        order_id: existingOrder.id,
        payment_id: razorpay_payment_id,
      });
    }

    const orderId = `ord_${Date.now()}`;
    const cleanCustomerName = customer?.name || 'Customer';
    const cleanEmail = customer?.email || '';
    const cleanPhone = customer?.phone || '';
    const cleanAddress = customer?.address || '';
    const cleanPincode = customer?.pincode || '';

    const { error: orderErr } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user_id || 'anonymous_buyer',
      razorpay_order_id,
      razorpay_payment_id,
      status: 'confirmed',
      payment_status: 'verified',
      total_amount: typeof amount === 'number' ? amount : 199,
      currency,
      customer_name: cleanCustomerName,
      customer_email: cleanEmail,
      customer_phone: cleanPhone,
      shipping_address: {
        fullName: cleanCustomerName,
        street: cleanAddress,
        city: customer?.city || 'India',
        postalCode: cleanPincode,
        country: 'India',
      },
      items: [
        {
          product_name: package_label || 'SignTap Laser-Engraved NFC Smart Card',
          quantity: body.quantity || 1,
          unit_price: typeof amount === 'number' ? amount : 199,
        },
      ],
      notes: `Razorpay Verified Payment: ${razorpay_payment_id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (orderErr) {
      console.warn('Supabase order insert note:', orderErr);
    }

    if (order_type === 'premium_upgrade' || package_label?.toLowerCase().includes('premium')) {
      const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      if (profile_id) {
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_plan: 'yearly',
            premium_until: oneYearLater,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile_id);
      } else if (username) {
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_plan: 'yearly',
            premium_until: oneYearLater,
            updated_at: new Date().toISOString(),
          })
          .eq('username', username.toLowerCase());
      }
    }

    if (user_id) {
      await supabase.from('notifications').insert({
        id: `notif_${Date.now()}`,
        recipient_id: user_id,
        actor_id: 'system',
        actor_name: 'SignTap Orders',
        actor_username: 'signtap',
        type: 'order_update',
        title: 'Payment Confirmed',
        message: `Your payment of ₹${amount || 199} (ID: ${razorpay_payment_id}) was verified successfully.`,
        link: '/dashboard/orders',
        read: false,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      order_id: orderId,
      payment_id: razorpay_payment_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal payment verification failure';
    console.error('API /api/razorpay/verify-payment error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
