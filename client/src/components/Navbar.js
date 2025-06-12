import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
      className="bg-white dark:bg-[var(--background)] shadow-lg py-4 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLink to="/dashboard" className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)]">
          Budget Planner
        </NavLink>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 text-[var(--foreground)] hover:text-[var(--primary-hover)] transition-colors duration-200 ${
                    isActive ? 'font-bold text-[var(--primary)]' : ''
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-4 py-2 text-[var(--foreground)] hover:text-[var(--primary-hover)] transition-colors duration-200 ${
                    isActive ? 'font-bold text-[var(--primary)]' : ''
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="button btn-danger"
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
                  `px-4 py-2 text-[var(--foreground)] hover:text-[var(--primary-hover)] transition-colors duration-200 ${
                    isActive ? 'font-bold text-[var(--primary)]' : ''
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 text-[var(--foreground)] hover:text-[var(--primary-hover)] transition-colors duration-200 ${
                    isActive ? 'font-bold text-[var(--primary)]' : ''
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