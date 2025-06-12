import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBudgets } from '../hooks/useBudgets';
import { FaUtensils, FaHome, FaBolt, FaFilm, FaCar, FaEllipsisH } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import toast from 'react-hot-toast';

const schema = z.object({
  category: z.enum(['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least 0.01'),
  month: z.date({ required_error: 'Please select a month' }).refine((date) => moment(date).isValid(), 'Invalid date'),
});

const categoryIcons = {
  Food: <FaUtensils className="text-blue-500" />,
  Rent: <FaHome className="text-red-500" />,
  Utilities: <FaBolt className="text-green-500" />,
  Entertainment: <FaFilm className="text-yellow-500" />,
  Transportation: <FaCar className="text-purple-500" />,
  Other: <FaEllipsisH className="text-gray-500" />,
};

const BudgetForm = () => {
  const { addBudget } = useBudgets();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [month, setMonth] = useState(new Date());
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: '',
      amount: '',
      month: new Date(),
    },
  });

  const onSubmit = (data) => {
    addBudget.mutate(
      {
        ...data,
        amount: Number(data.amount),
        month: moment(data.month).format('MMMM YYYY'),
      },
      {
        onSuccess: () => {
          reset();
          setMonth(new Date());
          setSelectedCategory('');
          setValue('month', new Date());
          toast.success('Budget added successfully');
        },
        onError: (err) => {
          toast.error(err.response?.data.message || 'Failed to add budget');
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Budget</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="category" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              {...register('category')}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoComplete="off"
            >
              <option value="" disabled>
                Select Category
              </option>
              {['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {categoryIcons[selectedCategory] || null}
            </div>
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter amount"
            autoComplete="off"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label htmlFor="month" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Month
          </label>
          <DatePicker
            id="month"
            selected={month}
            onChange={(date) => {
              setMonth(date);
              setValue('month', date, { shouldValidate: true });
            }}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            autoComplete="off"
            isClearable
            placeholderText="Select month"
          />
          {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={addBudget.isLoading}
        >
          {addBudget.isLoading ? 'Adding...' : 'Add Budget'}
        </button>
      </form>
    </motion.div>
  );
};

export default BudgetForm;