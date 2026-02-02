import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">About First Pet Veterinary clinic And Grooming</h1>
              <p className="text-lg text-gray-600 mb-4">
                For over 20 years, First Pet Veterinary clinic And Grooming has been dedicated to providing exceptional 
                veterinary care to pets in our community. Our experienced team of veterinarians and 
                staff are passionate about animal health and wellbeing.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                We offer a full range of veterinary services, from routine checkups and vaccinations 
                to emergency care and surgical procedures. Our state-of-the-art facility is equipped 
                with modern diagnostic and treatment equipment.
              </p>
              <p className="text-lg text-gray-600">
                We also operate a comprehensive pet pharmacy and online store, offering quality food, 
                medications, and accessories for your pets&apos; needs.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-gray-600">Happy Patients</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Emergency Care</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10+</div>
                  <div className="text-gray-600">Expert Staff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
