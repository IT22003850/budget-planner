import { useBudgets } from '../hooks/useBudgets';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Spinner from './Spinner';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { report, isReportLoading, isReportError, reportError } = useBudgets();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const filteredReport = useMemo(() => {
    if (!report || !Array.isArray(report)) {
      console.warn('Analytics: Report data is invalid or empty', report);
      return [];
    }
    return report.filter((item) => {
      if (!item.month || !item.category || typeof item.total !== 'number') {
        console.warn('Invalid report item:', item);
        return false;
      }
      const itemMoment = moment(item.month, 'MMMM YYYY');
      if (!itemMoment.isValid()) {
        console.warn('Invalid month format:', item.month);
        return false;
      }
      const startMoment = startDate ? moment(startDate).startOf('month') : null;
      const endMoment = endDate ? moment(endDate).endOf('month') : null;
      return (
        (!startMoment || itemMoment.isSameOrAfter(startMoment, 'month')) &&
        (!endMoment || itemMoment.isSameOrBefore(endMoment, 'month'))
      );
    });
  }, [report, startDate, endDate]);

  const barData = useMemo(() => ({
    labels: [...new Set(filteredReport.map((item) => item.month))].sort(),
    datasets: [
      {
        label: 'Total Budget',
        data: [...new Set(filteredReport.map((item) => item.month))]
          .sort()
          .map((month) =>
            filteredReport
              .filter((item) => item.month === month)
              .reduce((sum, item) => sum + (item.total || 0), 0)
          ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }), [filteredReport]);

  const pieData = useMemo(() => ({
    labels: ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'],
    datasets: [
      {
        data: ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'].map((category) =>
          filteredReport
            .filter((item) => item.category === category)
            .reduce((sum, item) => sum + (item.total || 0), 0)
        ),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [filteredReport]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#374151' } },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: '#374151' }, grid: { display: false } },
      y: { ticks: { color: '#374151' }, grid: { color: 'rgba(55, 65, 81, 0.1)' } },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Budget Analytics</h3>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 flex-1">
          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={debounce((date) => setStartDate(date), 300)}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            autoComplete="off"
            isClearable
            placeholderText="Select start month"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={debounce((date) => setEndDate(date), 300)}
            className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            autoComplete="off"
            isClearable
            placeholderText="Select end month"
          />
        </div>
      </div>
      {isReportLoading ? (
        <Spinner />
      ) : isReportError ? (
        <p className="text-red-500 text-center p-4">
          Failed to load analytics data: {reportError?.response?.data?.message || 'Please try again later.'}
        </p>
      ) : filteredReport.length === 0 ? (
        <p className="text-gray-500 text-center p-4">
          No analytics data available for the selected date range. Try adjusting the dates or adding budgets.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Monthly Budget</h4>
            <div className="h-[400px]">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Category Breakdown</h4>
            <div className="h-[400px]">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;