import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import BudgetModal from './BudgetModal';
import Spinner from './Spinner';
import { FaUtensils, FaHome, FaBolt, FaFilm, FaCar, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const categoryIcons = {
  Food: <FaUtensils className="text-blue-500" />,
  Rent: <FaHome className="text-red-500" />,
  Utilities: <FaBolt className="text-green-500" />,
  Entertainment: <FaFilm className="text-yellow-500" />,
  Transportation: <FaCar className="text-purple-500" />,
  Other: <FaEllipsisH className="text-gray-500" />,
};

const BudgetList = () => {
  const { budgets, isBudgetsLoading, isBudgetsError, budgetsError, updateBudget, deleteBudget } = useBudgets();
  const [editingBudget, setEditingBudget] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState(null);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleSave = (id, data) => {
    updateBudget.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditingBudget(null);
          toast.success('Budget updated successfully');
        },
        onError: (err) => {
          toast.error(err.response?.data.message || 'Failed to update budget');
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget.mutate(id, {
        onSuccess: () => toast.success('Budget deleted successfully'),
        onError: (err) => toast.error(err.response?.data.message || 'Failed to delete budget'),
      });
    }
  };

  const filteredBudgets = budgets.filter((budget) => {
    if (!budget.month) return false;
    const budgetMoment = moment(budget.month, 'MMMM YYYY');
    if (!budgetMoment.isValid()) return false;
    return (
      (!filterCategory || budget.category === filterCategory) &&
      (!filterMonth || budgetMoment.isSame(moment(filterMonth), 'month'))
    );
  });

  if (isBudgetsLoading) return <Spinner />;
  if (isBudgetsError)
    return (
      <p className="text-red-500 text-center p-4">
        Failed to load budgets: {budgetsError?.response?.data?.message || 'Please try again.'}
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Budgets</h3>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 flex-1">
          <label htmlFor="filterCategory" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Filter by Category
          </label>
          <select
            id="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            autoComplete="off"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="filterMonth" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            Filter by Month
          </label>
          <DatePicker
            id="filterMonth"
            selected={filterMonth}
            onChange={(date) => setFilterMonth(date)}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            autoComplete="off"
            placeholderText="Select month"
            isClearable
            aria-label="Filter by month"
          />
        </div>
      </div>
      {filteredBudgets.length === 0 ? (
        <p className="text-gray-500 text-center p-4">
          No budgets found. Try adjusting the filters or adding a new budget.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Budget list">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Category</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Amount</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Month</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.map((budget) => (
                <motion.tr
                  key={budget._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3 flex items-center space-x-2">
                    {categoryIcons[budget.category]}
                    <span>{budget.category}</span>
                  </td>
                  <td className="p-3">${budget.amount.toFixed(2)}</td>
                  <td className="p-3">{budget.month}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                      disabled={updateBudget.isLoading}
                      aria-label={`Edit ${budget.category} budget for ${budget.month}`}
                    >
                      <FaEdit className="mr-1" /> {updateBudget.isLoading ? 'Editing...' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      disabled={deleteBudget.isLoading}
                      aria-label={`Delete ${budget.category} budget for ${budget.month}`}
                    >
                      <FaTrash className="mr-1" /> {deleteBudget.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingBudget && (
        <BudgetModal budget={editingBudget} onSave={handleSave} onClose={() => setEditingBudget(null)} />
      )}
    </motion.div>
  );
};

export default BudgetList;