import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartContent from '@/components/CartContent';

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <CartContent />
      </div>
      <Footer />
    </main>
  );
}
