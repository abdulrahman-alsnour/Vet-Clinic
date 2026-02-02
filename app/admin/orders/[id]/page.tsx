'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  status: string;
  notes: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        const foundOrder = data.orders.find((o: Order) => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
          setStatus(foundOrder.status);
          setNotes(foundOrder.notes || '');
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        alert('Order updated successfully!');
        router.back();
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/admin/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Go Back
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">Order Details</span>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id.slice(-8)}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Customer Information</h2>
              <p className="text-gray-700">{order.customerName}</p>
              <p className="text-gray-700">{order.customerPhone}</p>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Delivery Method</h2>
              <p className="text-gray-700 capitalize">{order.deliveryMethod}</p>
              {order.deliveryMethod === 'delivery' && (
                <p className="text-gray-600 mt-2">{order.customerAddress}</p>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Payment Method</h2>
              <p className="text-gray-700 capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={(item.product.image && item.product.image.includes(',') ? item.product.image.split(',')[0] : item.product.image) || '/api/placeholder/400/400'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-primary font-semibold mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-primary text-2xl">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Update Order Status</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Add any notes about this order..."
              />
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating || status === order.status && notes === order.notes}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
