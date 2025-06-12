// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '../lib/api';
// import toast from 'react-hot-toast';

// const fetchBudgets = async () => {
//   const res = await api.get('/budget');
//   return res.data;
// };

// const fetchReport = async () => {
//   const res = await api.get('/budget/report');
//   return res.data;
// };

// export const useBudgets = () => {
//   const queryClient = useQueryClient();

//   const budgetsQuery = useQuery({
//     queryKey: ['budgets'],
//     queryFn: fetchBudgets,
//     onError: (err) => {
//       toast.error(err.response?.data.message || 'Failed to load budgets');
//     },
//   });

//   const reportQuery = useQuery({
//     queryKey: ['report'],
//     queryFn: fetchReport,
//     onError: (err) => {
//       toast.error(err.response?.data.message || 'Failed to load analytics data');
//     },
//   });

//   const addBudget = useMutation({
//     mutationFn: (budget) => api.post('/budget', budget),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['budgets']);
//       queryClient.invalidateQueries(['report']);
//       toast.success('Budget added successfully');
//     },
//     onError: (err) => toast.error(err.response?.data.message || 'Failed to add budget'),
//   });

//   const updateBudget = useMutation({
//     mutationFn: ({ id, data }) => api.put(`/budget/${id}`, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['budgets']);
//       queryClient.invalidateQueries(['report']);
//       toast.success('Budget updated successfully');
//     },
//     onError: (err) => toast.error(err.response?.data.message || 'Failed to update budget'),
//   });

//   const deleteBudget = useMutation({
//     mutationFn: (id) => api.delete(`/budget/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['budgets']);
//       queryClient.invalidateQueries(['report']);
//       toast.success('Budget deleted successfully');
//     },
//     onError: (err) => toast.error(err.response?.data.message || 'Failed to delete budget'),
//   });

//   return {
//     budgets: budgetsQuery.data || [],
//     report: reportQuery.data || [],
//     isBudgetsLoading: budgetsQuery.isLoading,
//     isReportLoading: reportQuery.isLoading,
//     isBudgetsError: budgetsQuery.isError,
//     isReportError: reportQuery.isError,
//     budgetsError: budgetsQuery.error,
//     reportError: reportQuery.error,
//     addBudget,
//     updateBudget,
//     deleteBudget,
//   };
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth'; // Import useAuth to get user
import api from '../lib/api';
import toast from 'react-hot-toast';

const fetchBudgets = async () => {
  console.log('Fetching budgets');
  const res = await api.get('/budget');
  return res.data;
};

const fetchReport = async () => {
  console.log('Fetching report');
  const res = await api.get('/budget/report');
  return res.data;
};

export const useBudgets = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const queryClient = useQueryClient();

  const budgetsQuery = useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: !!user, // Only fetch if user is logged in
    onError: (err) => {
      console.error('Budgets query error:', err);
      toast.error(err.response?.data.message || 'Failed to load budgets');
    },
  });

  const reportQuery = useQuery({
    queryKey: ['report'],
    queryFn: fetchReport,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: !!user, // Only fetch if user is logged in
    onError: (err) => {
      console.error('Report query error:', err);
      toast.error(err.response?.data.message || 'Failed to load analytics data');
    },
  });

  const addBudget = useMutation({
    mutationFn: (budget) => api.post('/budget', budget),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      queryClient.invalidateQueries(['report']);
      toast.success('Budget added successfully');
    },
    onError: (err) => toast.error(err.response?.data.message || 'Failed to add budget'),
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, data }) => api.put(`/budget/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      queryClient.invalidateQueries(['report']);
      toast.success('Budget updated successfully');
    },
    onError: (err) => toast.error(err.response?.data.message || 'Failed to update budget'),
  });

  const deleteBudget = useMutation({
    mutationFn: (id) => api.delete(`/budget/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      queryClient.invalidateQueries(['report']);
      toast.success('Budget deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data.message || 'Failed to delete budget'),
  });

  return {
    budgets: budgetsQuery.data || [],
    report: reportQuery.data || [],
    isBudgetsLoading: budgetsQuery.isLoading,
    isReportLoading: reportQuery.isLoading,
    isBudgetsError: budgetsQuery.isError,
    isReportError: reportQuery.isError,
    budgetsError: budgetsQuery.error,
    reportError: reportQuery.error,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};