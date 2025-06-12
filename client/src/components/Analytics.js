import { useBudgets } from '../hooks/useBudgets';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Spinner from './Spinner';
import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Detect theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  const getColor = (variable) => {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(variable).trim() ||
      (theme === 'dark' ? '#f3f4f6' : '#111827') // Fallback to theme-appropriate color
    );
  };

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

  const barData = useMemo(() => {
    const months = [...new Set(filteredReport.map((item) => item.month))].sort();
    const data = months.map((month) =>
      filteredReport
        .filter((item) => item.month === month)
        .reduce((sum, item) => sum + (item.total || 0), 0)
    );

    return {
      labels: months.length ? months : ['No Data'],
      datasets: [
        {
          label: 'Total Budget',
          data: months.length ? data : [0],
          backgroundColor: getColor('--primary') || '#3b82f6',
          borderColor: getColor('--primary-hover') || '#2563eb',
          borderWidth: 1,
        },
      ],
    };
  }, [filteredReport, theme]);

  const pieData = useMemo(() => {
    const categories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'];
    const data = categories.map((category) =>
      filteredReport
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + (item.total || 0), 0)
    );

    return {
      labels: categories,
      datasets: [
        {
          data: data.length && data.some((val) => val > 0) ? data : [1, 1, 1, 1, 1, 1],
          backgroundColor: [
            getColor('--primary') || '#3b82f6',
            getColor('--danger') || '#ef4444',
            getColor('--success') || '#10b981',
            getColor('--warning') || '#f59e0b',
            '#8b5cf6',
            '#6b7280',
          ],
          borderColor: [
            getColor('--primary-hover') || '#2563eb',
            getColor('--danger-hover') || '#dc2626',
            '#059669',
            '#d97706',
            '#7c3aed',
            '#4b5563',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [filteredReport, theme]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getColor('--foreground'),
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: getColor('--foreground'),
        bodyColor: getColor('--foreground'),
        borderColor: getColor('--border'),
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: getColor('--foreground') },
        grid: { color: getColor('--border') },
      },
      y: {
        ticks: { color: getColor('--foreground') },
        grid: { color: getColor('--border') },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 mb-8"
    >
      <h3 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Budget Analytics</h3>
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
        <div className="mb-4 sm:mb-0 flex-1">
          <label className="block font-medium mb-2 text-[var(--foreground)]">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={debounce((date) => setStartDate(date), 300)}
            className="input"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            autoComplete="off"
            isClearable
            placeholderText="Select start month"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-2 text-[var(--foreground)]">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={debounce((date) => setEndDate(date), 300)}
            className="input"
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
        <p className="text-[var(--danger)] text-center p-6">
          Failed to load analytics data: {reportError?.response?.data?.message || 'Please try again later.'}
        </p>
      ) : filteredReport.length === 0 ? (
        <p className="text-gray-500 text-center p-6">
          No analytics data available for the selected date range. Try adjusting the dates or adding budgets.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Monthly Budget</h4>
            <div className="h-[400px] relative" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
              <Bar key={`bar-${theme}`} data={barData} options={chartOptions} />
            </div>
          </div>
          <div className="card p-6">
            <h4 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Category Breakdown</h4>
            <div className="h-[400px] relative" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
              <Pie key={`pie-${theme}`} data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
