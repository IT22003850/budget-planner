import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(null, {
      onSuccess: () => {
        toast.success('Logged out successfully');
        navigate('/login');
      },
      onError: () => {
        toast.error('Logout failed. Please try again.');
      },
    });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-md py-4"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLink to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Budget Planner
        </NavLink>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                    isActive ? 'font-bold text-blue-500 dark:text-blue-400' : ''
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                    isActive ? 'font-bold text-blue-500 dark:text-blue-400' : ''
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={logout.isLoading}
              >
                {logout.isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                    isActive ? 'font-bold text-blue-500 dark:text-blue-400' : ''
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                    isActive ? 'font-bold text-blue-500 dark:text-blue-400' : ''
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;