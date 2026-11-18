'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, getOrdersByUserId, getAllOrders } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ExternalLink, 
  ArrowRight, 
  CreditCard, 
  AlertCircle,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const userOrders = getOrdersByUserId(user.id);
      // If none found for this user in demo mode, show all sample orders
      setOrders(userOrders.length > 0 ? userOrders : getAllOrders());
    } else {
      setOrders(getAllOrders());
    }
    setLoading(false);
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'order_received':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">Order Received</span>;
      case 'payment_pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">Payment Pending</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">Processing</span>;
      case 'in_production':
        return <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF7900] text-xs font-semibold border border-orange-200">In Production</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{status}</span>;
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    const sequence = ['order_received', 'payment_pending', 'confirmed', 'processing', 'in_production', 'shipped', 'delivered'];
    return sequence.indexOf(status);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101828]">
            My NFC Card Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track hardware manufacturing, shipment dispatch, and payment verification.
          </p>
        </div>

        <Link
          href="/order"
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#087CF0] hover:bg-[#0668cc] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
        >
          <CreditCard className="w-4 h-4" />
          <span>Order New Card</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#087CF0] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#101828]">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You have not placed any physical NFC smart card orders yet.
          </p>
          <div className="pt-2">
            <Link
              href="/order"
              className="py-2.5 px-5 rounded-xl bg-[#087CF0] text-white text-xs font-semibold hover:bg-[#0668cc]"
            >
              Order Your First NFC Card
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const stepIdx = getStepIndex(order.status);
            return (
              <div 
                key={order.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Order Reference
                    </span>
                    <h3 className="text-lg font-mono font-extrabold text-[#101828]">
                      {order.order_number}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-bold text-[#101828]">
                      ${order.total_amount}.00 {order.currency}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="pt-2 pb-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                    <span className={stepIdx >= 0 ? 'text-[#087CF0]' : ''}>Order Placed</span>
                    <span className={stepIdx >= 1 ? 'text-[#087CF0]' : ''}>Payment</span>
                    <span className={stepIdx >= 2 ? 'text-[#087CF0]' : ''}>Confirmed</span>
                    <span className={stepIdx >= 4 ? 'text-[#087CF0]' : ''}>In Production</span>
                    <span className={stepIdx >= 5 ? 'text-[#087CF0]' : ''}>Shipped</span>
                    <span className={stepIdx >= 6 ? 'text-emerald-600' : ''}>Delivered</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${stepIdx >= 6 ? 'bg-emerald-500' : 'bg-[#087CF0]'}`}
                      style={{ width: `${Math.min(100, Math.max(15, ((stepIdx + 1) / 7) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Items & Shipping Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Card Items:
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{item.product_name}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          {item.custom_name_to_print && (
                            <p className="text-[11px] text-[#087CF0] mt-1">
                              Engraved Name: &ldquo;{item.custom_name_to_print}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Delivery Address & Tracking:
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <p className="font-semibold text-slate-800">{order.shipping_address.fullName}</p>
                      <p className="text-slate-600">{order.shipping_address.street}, {order.shipping_address.city}</p>
                      <p className="text-slate-600">{order.shipping_address.state} {order.shipping_address.postalCode}, {order.shipping_address.country}</p>
                      {order.tracking_number ? (
                        <p className="pt-2 text-emerald-700 font-mono font-bold flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Tracking: {order.tracking_number}</span>
                        </p>
                      ) : (
                        <p className="pt-2 text-slate-400 italic">
                          Tracking number will be assigned once shipped.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification Status */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Method: {order.payment_method}</span>
                  </span>
                  <span className="font-mono text-[11px]">
                    Status: <b className="capitalize">{order.status.replace('_', ' ')}</b>
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

