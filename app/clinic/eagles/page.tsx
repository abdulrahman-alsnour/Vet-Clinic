import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Staff from '@/components/Staff';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function EaglesVetClinicPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Staff />
      <Contact />
      <Footer />
    </main>
  );
}

