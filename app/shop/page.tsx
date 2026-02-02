'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopProducts from '@/components/ShopProducts';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  // Default to our shop
  const isEaglesShop = shop === 'eagles-vet' || !shop;

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {isEaglesShop ? "First Pet Veterinary clinic And Grooming - Our Products" : "Our Products"}
        </h1>
        <ShopProducts />
      </div>
      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading shop...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
