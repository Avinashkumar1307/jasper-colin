'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProductForm from '../../../components/ProductForm';
import toast from 'react-hot-toast';

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${params.id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (data: { name: string; description: string; price: number; category: string }) => {
    await api.put(`/products/${params.id}`, data);
    toast.success('Product updated successfully!');
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update the product details below.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Update Product" />
      </div>
    </div>
  );
}
