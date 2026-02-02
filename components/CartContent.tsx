'use client';

import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { cartState, CartItem } from '@/lib/atoms/cart';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartContent() {
  const [cart, setCart] = useRecoilState(cartState);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'click'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    area: '',
    address: '',
  });

  // Load user profile information on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Pre-fill form with user's profile information from localStorage
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          governorate: user.governorate || '',
          area: user.area || '',
          address: user.address || '',
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);

  // Jordanian Governorates and Areas
  const governorates = {
    'Amman Governorate': ['Amman', 'Sahab', 'Wadi Al-Seer', 'Jubeiha', 'Marj Al-Hamam', 'Sweileh', 'Abu Alanda', 'Al-Muwaqqar', 'Naour'],
    'Zarqa Governorate': ['Zarqa', 'Russeifa', 'Hashimiyah', 'Azraq'],
    'Irbid Governorate': ['Irbid', 'Ramtha', 'Bani Kinanah', 'Mazar Al-Shamali', 'Kafr Yuba', 'Taybeh'],
    'Balqa Governorate': ['Salt', 'Fuheis', 'Mahis', 'Ain Al-Basha', 'Deir Alla'],
    'Mafraq Governorate': ['Mafraq', 'Ruweished', 'Sabha', 'Umm Al-Jimal'],
    'Jerash Governorate': ['Jerash', 'Souf', 'Sakib'],
    'Ajloun Governorate': ['Ajloun', 'Kufranja', 'Anjara'],
    'Madaba Governorate': ['Madaba', 'Dhiban', 'Ma\'in'],
    'Karak Governorate': ['Karak', 'Qatraneh', 'Mazar Al-Janoubi', 'Mutah', 'Rabba'],
    'Tafilah Governorate': ['Tafilah', 'Busaira', 'Hasa'],
    'Ma\'an Governorate': ['Ma\'an', 'Petra (Wadi Musa)', 'Shoubak', 'Al-Hussainiyah'],
    'Aqaba Governorate': ['Aqaba', 'Quweira', 'Rahma'],
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 3 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get user ID from localStorage if user is logged in
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const fullAddress = deliveryMethod === 'delivery'
        ? `${formData.governorate}, ${formData.area}, ${formData.address}`
        : 'Pickup from Store';

      const orderData = {
        userId: user?.id || null, // Include userId if logged in
        customerName: formData.name,
        customerEmail: user?.email || '', // Use user email if available
        customerPhone: formData.phone,
        customerAddress: fullAddress,
        deliveryMethod,
        paymentMethod: deliveryMethod === 'pickup' ? 'cash' : paymentMethod, // Default to 'cash' for pickup
        orderItems: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear cart
        setCart([]);
        // Redirect to success page
        router.push('/order-success');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
            <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={(item.image && item.image.includes(',') ? item.image.split(',')[0] : item.image) || '/api/placeholder/400/400'}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-lg font-bold text-primary mb-2">
                {formatPrice(item.price)}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={(e) => {
                    setDeliveryMethod(e.target.value as 'delivery' | 'pickup');
                    setPaymentMethod('cash'); // Reset to default when switching
                  }}
                  className="text-primary"
                />
                <span>Home Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={(e) => {
                    setDeliveryMethod(e.target.value as 'delivery' | 'pickup');
                    setPaymentMethod('cash'); // Reset to default when switching
                  }}
                  className="text-primary"
                />
                <span>Pickup from Store</span>
              </label>
            </div>
          </div>

          {/* Payment Method - Only show for delivery */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'click')}
                    className="text-primary"
                  />
                  <span>Cash</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="click"
                    checked={paymentMethod === 'click'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'click')}
                    className="text-primary"
                  />
                  <span>Click</span>
                </label>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Address Fields */}
          {deliveryMethod === 'delivery' && (
            <>
              {/* Governorate */}
              <div>
                <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                  Governorate *
                </label>
                <select
                  id="governorate"
                  required={deliveryMethod === 'delivery'}
                  value={formData.governorate}
                  onChange={(e) => {
                    setFormData({ ...formData, governorate: e.target.value, area: '' });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Governorate</option>
                  {Object.keys(governorates).map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              {formData.governorate && (
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area *
                  </label>
                  <select
                    id="area"
                    required={deliveryMethod === 'delivery'}
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Area</option>
                    {governorates[formData.governorate as keyof typeof governorates]?.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Street Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <textarea
                  id="address"
                  required={deliveryMethod === 'delivery'}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  placeholder="Street name, building number, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {/* Order Summary */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee:</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
