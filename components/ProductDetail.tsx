'use client';

import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { cartState, CartItem } from '@/lib/atoms/cart';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useRecoilState(cartState);
  const [isAdding, setIsAdding] = useState(false);
  const [productData, setProductData] = useState(product);
  const router = useRouter();
  
  // Parse product images (comma-separated string)
  const images = productData.image ? productData.image.split(',').map(img => img.trim()) : ['/api/placeholder/400/400'];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // Track product view
    const trackProductView = async () => {
      try {
        await fetch('/api/analytics/productview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
      } catch (error) {
        console.error('Error tracking product view:', error);
      }
    };

    trackProductView();

    // Fetch latest product data only on initial load
    // No polling - stock updates will reflect on page refresh or when user returns
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/products?slug=${product.slug}`);
        const data = await response.json();
        if (data.product) {
          setProductData(data.product);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [product.id, product.slug]);

  const addToCart = () => {
    setIsAdding(true);
    
    const cartItem: CartItem = {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      quantity,
    };

    // Check if item already in cart
    const existingItem = cart.find((item) => item.id === productData.id);
    
    if (existingItem) {
      // Update quantity if item exists
      setCart(
        cart.map((item) =>
          item.id === productData.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      setCart([...cart, cartItem]);
    }

    setTimeout(() => {
      setIsAdding(false);
      // Optional: show success message
      alert('Item added to cart!');
    }, 300);
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[selectedImageIndex]}
              alt={productData.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${productData.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="text-sm text-gray-600">{productData.category.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{productData.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(productData.price)}
          </p>
          
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">{productData.description}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {productData.stock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock ({productData.stock} available)</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                disabled={quantity >= productData.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <button
              onClick={addToCart}
              disabled={productData.stock === 0 || isAdding}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={goToCart}
              className="w-full border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
