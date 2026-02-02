'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/lib/atoms/cart';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const cart = useRecoilValue(cartState);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const homePath = '/';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Close mobile menu on click
    setMobileMenuOpen(false);
    
    // Handle smooth scroll for anchor links on home page
    if (href.startsWith('#') && (pathname === '/' || pathname.startsWith('/clinic/'))) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center min-w-0">
            <Link 
              href={user ? "/user/dashboard" : homePath} 
              className="text-base sm:text-lg lg:text-xl font-bold text-primary hover:opacity-80 transition-opacity leading-tight"
            >
              <span className="hidden sm:inline">First Pet Veterinary clinic And Grooming</span>
              <span className="sm:hidden">First Pet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {user ? (
              // User is logged in - show user menu items
              <>
                <Link
                  href="/user/orders"
                  className={`${
                    isActive('/user/orders') ? 'text-primary font-semibold' : 'text-gray-700'
                  } hover:text-primary transition-colors`}
                >
                  My Orders
                </Link>
                <Link
                  href="/user/appointments"
                  className={`${
                    isActive('/user/appointments') ? 'text-primary font-semibold' : 'text-gray-700'
                  } hover:text-primary transition-colors`}
                >
                  Appointments
                </Link>
                <Link
                  href="/user/profile"
                  className={`${
                    isActive('/user/profile') ? 'text-primary font-semibold' : 'text-gray-700'
                  } hover:text-primary transition-colors`}
                >
                  My Profile
                </Link>
                <Link
                  href="/user/pets"
                  className={`${
                    isActive('/user/pets') ? 'text-primary font-semibold' : 'text-gray-700'
                  } hover:text-primary transition-colors`}
                >
                  My Pets
                </Link>
              </>
            ) : (
              // User is not logged in - show normal menu items
              <>
                <Link
                  href={homePath}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(homePath) ? 'text-primary bg-primary/10 font-semibold' : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href={`${homePath}#services`}
                  onClick={(e) => handleNavClick(e, '#services')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  About
                </Link>
                <Link
                  href={`${homePath}#staff`}
                  onClick={(e) => handleNavClick(e, '#staff')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  Team
                </Link>
                <Link
                  href={`${homePath}#contact`}
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  Contact
                </Link>
              </>
            )}
                <Link
                  href="/shop"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  Shop
                </Link>
          </nav>

          {/* Desktop Cart & User */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <Link
              href="/cart"
              className="relative inline-flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  href="/user/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  {user.name || user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/user"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/admin/login"
                  className="bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Cart and Menu for Tablets/Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/cart"
              className="relative inline-flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              {user ? (
                // User is logged in - show user menu items
                <>
                  <Link
                    href="/user/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive('/user/orders') ? 'text-primary font-semibold' : 'text-gray-700'
                    } hover:text-primary transition-colors px-2 py-2`}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/user/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive('/user/appointments') ? 'text-primary font-semibold' : 'text-gray-700'
                    } hover:text-primary transition-colors px-2 py-2`}
                  >
                    Appointments
                  </Link>
                  <Link
                    href="/user/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive('/user/profile') ? 'text-primary font-semibold' : 'text-gray-700'
                    } hover:text-primary transition-colors px-2 py-2`}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/user/pets"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive('/user/pets') ? 'text-primary font-semibold' : 'text-gray-700'
                    } hover:text-primary transition-colors px-2 py-2`}
                  >
                    My Pets
                  </Link>
                </>
              ) : (
                // User is not logged in - show normal menu items
                <>
                  <Link
                    href={homePath}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive(homePath) ? 'text-primary font-semibold' : 'text-gray-700'
                    } hover:text-primary transition-colors px-2 py-2`}
                  >
                    Home
                  </Link>
                  <Link
                    href={`${homePath}#services`}
                    onClick={(e) => handleNavClick(e, '#services')}
                    className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
                  >
                    Services
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
                  >
                    About Us
                  </Link>
                  <Link
                    href={`${homePath}#staff`}
                    onClick={(e) => handleNavClick(e, '#staff')}
                    className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
                  >
                    Our Team
                  </Link>
                  <Link
                    href={`${homePath}#contact`}
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
                  >
                    Contact
                  </Link>
                </>
              )}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
              >
                Shop
              </Link>
                                <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-gray-700 hover:text-primary transition-colors px-2 py-2"
                  >
                    <span>Shopping Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 px-2 py-2">
                      {user ? `Signed in as: ${user.name || user.email}` : 'Not signed in'}
                    </div>
                  </div>
                  {user ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-gray-700 hover:text-primary transition-colors px-2 py-2 text-left w-full bg-red-50 hover:bg-red-100 rounded-lg"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/user"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-primary transition-colors px-2 py-2"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                  {!user && (
                    <div className="pt-2 border-t border-gray-200">
                      <Link
                        href="/admin/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full text-center"
                      >
                        Admin
                      </Link>
                    </div>
                  )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
