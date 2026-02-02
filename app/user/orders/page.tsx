'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { cartState, CartItem } from '@/lib/atoms/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UserOrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cart, setCart] = useRecoilState(cartState);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchOrders(userData.id);
  }, [router]);

  const fetchOrders = async (userId: string) => {
    try {
      // Fetch user's orders with server-side filtering
      const response = await fetch(`/api/orders?userId=${userId}`);
      const data = await response.json();
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: any) => {
    const newCartItems = order.orderItems.map((item: any) => ({
      id: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.price,
      image: item.product.image.split(',')[0], // Use first image
      quantity: item.quantity,
    }));

    // Add to cart (merge with existing cart)
    const existingCartIds = new Set(cart.map((item: CartItem) => item.id));
    const newItems = newCartItems.filter((item: CartItem) => !existingCartIds.has(item.id));
    
    setCart([...cart, ...newItems]);
    
    // Show success message and redirect to cart
    alert(`Added ${newItems.length} item(s) to your cart!`);
    router.push('/cart');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'visa':
        return 'Visa';
      case 'click':
        return 'Click';
      default:
        return method;
    }
  };

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case 'delivery':
        return 'Home Delivery';
      case 'pickup':
        return 'Pickup from Store';
      case 'instore':
        return 'In-Store Purchase';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link
              href="/user/dashboard"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">No orders yet</p>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Go Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">JD {order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            {order.deliveryMethod !== 'instore' && order.deliveryMethod === 'delivery'
                              ? 'JD 3.00 delivery fee included'
                              : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Items ({order.orderItems.length})</h4>
                      <div className="space-y-2">
                        {order.orderItems.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">{item.quantity}x</span>
                            <span>{item.product.name}</span>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <p className="text-sm text-gray-500">+ {order.orderItems.length - 3} more item(s)</p>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Delivery Method:</p>
                        <p className="font-semibold text-gray-900">{getDeliveryMethodName(order.deliveryMethod)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method:</p>
                        <p className="font-semibold text-gray-900">{getPaymentMethodName(order.paymentMethod)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                      >
                        Order Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-gray-900 text-lg">JD {selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image.split(',')[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">JD {item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">per item</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedOrder.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-gray-900">{getDeliveryMethodName(selectedOrder.deliveryMethod)}</p>
                    <p><span className="text-gray-600">Payment:</span> {getPaymentMethodName(selectedOrder.paymentMethod)}</p>
                    {selectedOrder.customerAddress && (
                      <p className="text-gray-600">{selectedOrder.customerAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleReorder(selectedOrder)}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Order Again
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
