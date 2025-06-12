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
  Food: <FaUtensils className="text-[var(--primary)]" />,
  Rent: <FaHome className="text-[var(--danger)]" />,
  Utilities: <FaBolt className="text-[var(--success)]" />,
  Entertainment: <FaFilm className="text-[var(--warning)]" />,
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
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="edit-budget-title"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="card p-8 w-full max-w-md"
      >
        <h3 id="edit-budget-title" className="text-2xl font-bold mb-6 text-[var(--foreground)]">
          Edit Budget
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="category" className="block font-medium mb-2 text-[var(--foreground)]">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                {...register('category')}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pr-10"
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
            {errors.category && <p className="text-[var(--danger)] text-sm mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label htmlFor="amount" className="block font-medium mb-2 text-[var(--foreground)]">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="input"
              autoComplete="off"
              aria-label="Enter amount"
            />
            {errors.amount && <p className="text-[var(--danger)] text-sm mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label htmlFor="month" className="block font-medium mb-2 text-[var(--foreground)]">
              Month
            </label>
            <DatePicker
              id="month"
              selected={month}
              onChange={(date) => {
                setMonth(date);
                setValue('month', date, { shouldValidate: true });
              }}
              className="input"
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              autoComplete="off"
              isClearable
              placeholderText="Select month"
              aria-label="Select month"
            />
            {errors.month && <p className="text-[var(--danger)] text-sm mt-1">{errors.month.message}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="button btn-secondary"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button btn-primary"
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