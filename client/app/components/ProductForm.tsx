'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

interface ProductData {
  name: string;
  description: string;
  price: number | string;
  category: string;
}

interface ProductFormProps {
  initialData?: ProductData;
  onSubmit: (data: { name: string; description: string; price: number; category: string }) => Promise<void>;
  submitLabel?: string;
}

export default function ProductForm({ initialData, onSubmit, submitLabel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe your product..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            Price <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
              className={`${inputClasses} pl-8`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Electronics"
            value={formData.category}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 px-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all active:scale-[0.98]"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : (
          submitLabel || 'Save'
        )}
      </button>
    </form>
  );
}
