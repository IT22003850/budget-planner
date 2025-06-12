import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaUtensils, FaHome, FaBolt, FaFilm, FaCar, FaEllipsisH } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

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

const BudgetModal = ({ budget, onSave, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(budget.category);
  const [month, setMonth] = useState(moment(budget.month, 'MMMM YYYY').toDate());
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: budget.category,
      amount: budget.amount,
      month: moment(budget.month, 'MMMM YYYY').toDate(),
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onSubmit = (data) => {
    onSave(budget._id, {
      ...data,
      amount: Number(data.amount),
      month: moment(data.month).format('MMMM YYYY'),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="edit-budget-title"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <h3 id="edit-budget-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Edit Budget
        </h3>
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
                aria-label="Select category"
              >
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
              autoComplete="off"
              aria-label="Enter amount"
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
              aria-label="Select month"
            />
            {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              aria-label="Save"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BudgetModal;