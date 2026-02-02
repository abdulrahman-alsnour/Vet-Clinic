'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const homePath = '/';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">First Pet Veterinary clinic And Grooming</h3>
            <p className="text-gray-400">
              Caring for your pets with love and expertise since 2003.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href={homePath} 
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href={`${homePath}#services`} 
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href={`${homePath}#staff`} 
                  className="hover:text-white transition-colors"
                >
                  Our Team
                </a>
              </li>
              <li>
                <a 
                  href="/shop" 
                  className="hover:text-white transition-colors"
                >
                  Shop
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>General Checkups</li>
              <li>Vaccinations</li>
              <li>Pet Hotel</li>
              <li>Surgery</li>
              <li>Emergency Care</li>
              <li>Pet Pharmacy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Jbeiha, Alawzai Street</li>
              <li>Amman, Jordan</li>
              <li><a href="tel:+962796060639" className="hover:text-white transition-colors">+962 7 9606 0639</a></li>
              <li><a href="mailto:info@eaglesvet.com" className="hover:text-white transition-colors">info@eaglesvet.com</a></li>
              <li className="pt-2 flex gap-3">
                <a href="https://wa.me/962796060639" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
                  📱
                </a>
                <a href="https://www.instagram.com/eaglesvetclinic/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                  📷
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} First Pet Veterinary clinic And Grooming. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
