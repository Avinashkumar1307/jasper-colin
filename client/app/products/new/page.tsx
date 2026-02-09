'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProductForm from '../../components/ProductForm';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: { name: string; description: string; price: number; category: string }) => {
    await api.post('/products', data);
    toast.success('Product created successfully!');
    router.push('/products');
  };

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to create a new product.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
}
