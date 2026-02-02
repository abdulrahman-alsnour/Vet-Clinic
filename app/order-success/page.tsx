'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const [homeLink, setHomeLink] = useState('/');

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      // If logged in, redirect to customer dashboard
      setHomeLink('/user/dashboard');
    } else {
      // If not logged in, redirect to landing page
      setHomeLink('/');
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. We will contact you shortly to confirm your order details.
          </p>
          <p className="text-gray-600 mb-8">
            Your order will be prepared and delivered according to your selected method.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href={homeLink}
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
