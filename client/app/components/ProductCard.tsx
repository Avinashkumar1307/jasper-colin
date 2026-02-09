'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const { user } = useAuth();

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight pr-2">
          {product.name}
        </h3>
        <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
          {product.category || 'Uncategorized'}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-10">
        {product.description || 'No description provided'}
      </p>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5">Price</p>
          <p className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {user && (
          <div className="flex gap-2">
            <Link
              href={`/products/${product._id}/edit`}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(product._id)}
              className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
