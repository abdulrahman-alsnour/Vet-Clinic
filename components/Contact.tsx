export default function Contact() {
  return (
    <section id="contact" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Contact Us</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Visit us or get in touch for appointments and inquiries
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-12">
          {/* Location Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📍</span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Visit Us</h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-center text-sm leading-relaxed">
              Jbeiha, Alawzai Street<br />
              Amman, Jordan
            </p>
            <div className="space-y-2">
              <a
                href="https://maps.app.goo.gl/3EQjKiGuHio7Z3Se7"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-center text-sm md:text-base"
              >
                Open in Google Maps
              </a>
              <div className="space-y-2 md:space-y-3">
                <a
                  href="https://wa.me/962796060639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-[#22C55E] transition-colors text-sm md:text-base"
                >
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/eaglesvetclinic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors text-sm md:text-base"
                >
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🩺</span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Online Services</h3>
            <div className="text-gray-700 space-y-2 md:space-y-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <p>Book Appointments</p>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <p>Pet Hotel Reservations</p>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <p>Track Orders</p>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <p>Manage Pet Profiles</p>
              </div>
            </div>
            <a
              href="/user"
              className="block w-full bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all text-center text-sm md:text-base"
            >
              Login / Sign Up
            </a>
          </div>

          {/* Hours Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-50 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🕒</span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">Business Hours</h3>
            <div className="text-gray-700 space-y-2 md:space-y-3 text-sm">
              <div className="pb-2 md:pb-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Mon - Thu</p>
                <p className="text-gray-600">9:00 AM - 11:30 PM</p>
              </div>
              <div className="pb-2 md:pb-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Friday</p>
                <p className="text-gray-600">2:00 PM - 8:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sat - Sun</p>
                <p className="text-gray-600">9:00 AM - 11:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email and Phone */}
        <div className="text-center px-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-white px-6 sm:px-8 py-4 rounded-lg shadow-sm border border-gray-100">
            <a href="tel:+962796060639" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl sm:text-2xl">📞</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">+962 7 9606 0639</p>
              </div>
            </a>
            <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
            <div className="w-full sm:w-auto h-px sm:h-auto sm:w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">✉️</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">info@eaglesvet.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
