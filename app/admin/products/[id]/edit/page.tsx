'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

export default function EditProduct() {
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    categoryId: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/admin/products'),
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const foundProduct = productsData.products.find((p: Product) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price.toString(),
            image: foundProduct.image,
            stock: foundProduct.stock.toString(),
            categoryId: foundProduct.category.id,
          });
          // Initialize uploadedImages with existing product images (split by comma)
          setUploadedImages(foundProduct.image.includes(',') ? foundProduct.image.split(',') : [foundProduct.image]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadingIndex(i);
      
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadedImages(prev => [...prev, data.url]);
        } else {
          console.error('Upload error:', data);
          alert(`Failed to upload image ${i + 1}: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`An error occurred while uploading image ${i + 1}`);
      }
    }
    
    setUploadingIndex(null);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageSelect = (index: number) => {
    const selectedImage = uploadedImages[index];
    const newImages = [selectedImage, ...uploadedImages.filter((_, i) => i !== index)];
    setUploadedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        image: uploadedImages.join(','), // Join all images with comma
        categoryId: formData.categoryId,
      };

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product updated successfully!');
        router.back();
      } else {
        console.error('Update error:', data);
        alert(`Failed to update product: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/admin/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                First Pet Veterinary clinic And Grooming
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">Edit Product</span>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (JOD) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Img</h2>
              
              {/* Image Layout */}
              <div className="flex gap-4">
                {/* Main Image Display */}
                <div className="flex-shrink-0 max-w-md">
                  {uploadedImages.length > 0 ? (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={uploadedImages[0]}
                        alt="Main product image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <p className="text-gray-400">No image uploaded</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Column */}
                <div className="flex flex-col gap-3 flex-1">
                  {uploadedImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
                        index === 0 ? 'ring-2 ring-primary shadow-md' : 'ring-1 ring-gray-300'
                      }`}
                      onClick={() => handleImageSelect(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                          main
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  <label 
                    htmlFor="images"
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors bg-white"
                  >
                    <span className="text-3xl text-primary font-light">+</span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {uploadingIndex !== null && (
                <p className="mt-3 text-sm text-gray-600">Uploading image {uploadingIndex + 1}...</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting || uploadedImages.length === 0}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
              <Link
                href="/admin/dashboard"
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
