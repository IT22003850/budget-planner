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
  Food: <FaUtensils className="text-[var(--primary)]" />,
  Rent: <FaHome className="text-[var(--danger)]" />,
  Utilities: <FaBolt className="text-[var(--success)]" />,
  Entertainment: <FaFilm className="text-[var(--warning)]" />,
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
      <p className="text-[var(--danger)] text-center p-6">
        Failed to load budgets: {budgetsError?.response?.data?.message || 'Please try again.'}
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8"
    >
      <h3 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Your Budgets</h3>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 flex-1">
          <label htmlFor="filterCategory" className="block font-medium mb-2 text-[var(--foreground)]">
            Filter by Category
          </label>
          <select
            id="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
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
          <label htmlFor="filterMonth" className="block font-medium mb-2 text-[var(--foreground)]">
            Filter by Month
          </label>
          <DatePicker
            id="filterMonth"
            selected={filterMonth}
            onChange={(date) => setFilterMonth(date)}
            className="input"
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
        <p className="text-gray-500 text-center p-6">
          No budgets found. Try adjusting the filters or adding a new budget.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table" aria-label="Budget list">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.map((budget) => (
                <motion.tr
                  key={budget._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="flex items-center space-x-2">
                    {categoryIcons[budget.category]}
                    <span>{budget.category}</span>
                  </td>
                  <td>${budget.amount.toFixed(2)}</td>
                  <td>{budget.month}</td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="button btn-primary flex items-center space-x-1"
                      disabled={updateBudget.isLoading}
                      aria-label={`Edit ${budget.category} budget for ${budget.month}`}
                    >
                      <FaEdit /> <span>{updateBudget.isLoading ? 'Editing...' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="button btn-danger flex items-center space-x-1"
                      disabled={deleteBudget.isLoading}
                      aria-label={`Delete ${budget.category} budget for ${budget.month}`}
                    >
                      <FaTrash /> <span>{deleteBudget.isLoading ? 'Deleting...' : 'Delete'}</span>
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