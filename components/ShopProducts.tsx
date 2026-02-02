'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  category: Category;
}

export default function ShopProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${selectedCategory}&sort=${sortBy}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMainCategories = () => {
    return ['All Products', 'Dogs', 'Cats', 'Birds', 'Fish & Aquatic', 'Small Animals', 'Reptiles', 'General'];
  };

  const getSubcategories = (mainCategory: string) => {
    if (mainCategory === 'All Products') return [];
    
    // Map main categories to their prefixes
    const prefixMap: { [key: string]: string[] } = {
      'Dogs': ['dog'],
      'Cats': ['cat'],
      'Birds': ['bird'],
      'Fish & Aquatic': ['fish'],
      'Small Animals': ['small'],
      'Reptiles': ['reptile'],
      'General': ['general', 'housing', 'cleaning']
    };
    
    const prefixes = prefixMap[mainCategory] || [];
    if (prefixes.length === 0) return [];
    
    return categories.filter(cat => 
      prefixes.some(prefix => cat.name.toLowerCase().startsWith(prefix))
    );
  };

  const handleMainCategoryClick = (category: string) => {
    if (category === 'All Products') {
      setSelectedMainCategory(null);
      setSelectedCategory('all');
    } else {
      setSelectedMainCategory(category);
    }
  };

  const handleSubcategoryClick = (slug: string) => {
    setSelectedCategory(slug);
  };

  const removeItemCount = (name: string) => {
    // Remove patterns like "(8 items)", "(1 item)", etc.
    return name.replace(/\s*\([^)]*\)\s*$/, '');
  };

  const subcategories = selectedMainCategory ? getSubcategories(selectedMainCategory) : [];
  const displayCategories = selectedMainCategory ? subcategories : getMainCategories();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Categories Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
          {selectedMainCategory && (
            <button
              onClick={() => {
                setSelectedMainCategory(null);
                setSelectedCategory('all');
              }}
              className="mb-4 text-sm text-primary hover:underline"
            >
              ← Back
            </button>
          )}
          <ul className="space-y-2">
            {displayCategories.map((category) => {
              const isActive = typeof category === 'string'
                ? selectedMainCategory === category
                : selectedCategory === category.slug;

              return (
                <li key={typeof category === 'string' ? category : category.id}>
                  <button
                    onClick={() => {
                      if (typeof category === 'string') {
                        handleMainCategoryClick(category);
                      } else {
                        handleSubcategoryClick(category.slug);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {typeof category === 'string' ? category : removeItemCount(category.name)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Sort Options */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-700">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={(product.image && product.image.includes(',') ? product.image.split(',')[0] : product.image) || '/api/placeholder/400/400'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{product.category.name}</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
