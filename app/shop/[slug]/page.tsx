import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  return product;
}

export default async function ProductPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: Promise<{ shop?: string }> | { shop?: string }
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Resolve searchParams if it's a Promise (Next.js 15+)
  const resolvedSearchParams = await Promise.resolve(searchParams);
  
  return (
    <main className="min-h-screen">
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
