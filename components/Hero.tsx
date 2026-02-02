'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Hero() {
  const pathname = usePathname();

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/' || pathname.startsWith('/clinic/')) {
      e.preventDefault();
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Image Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80)'
        }}
      >
      </div>
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-cyan-900/70"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
          Caring for Your Pets, One Paw at a Time
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow-md">
          Professional veterinary services and quality pet products for your furry family members
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Shop Products
          </Link>
          <a
            href={(pathname === '/' || pathname.startsWith('/clinic/')) ? `#contact` : '/#contact'}
            onClick={handleContactClick}
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
