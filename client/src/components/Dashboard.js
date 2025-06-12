import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import Analytics from './Analytics';
import Spinner from './Spinner';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <Spinner />;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-10"
    >
      <div className="card p-8 mb-8">
        <h2 className="text-3xl font-bold mb-4 text-[var(--foreground)]">Welcome, {user.username}</h2>
      </div>
      <BudgetForm />
      <Analytics />
      <BudgetList />
    </motion.div>
  );
};

export default Dashboard;