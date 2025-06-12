import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleUpdatePassword = async (data) => {
    if (!data.password) {
      setError('Please enter a new password');
      return;
    }
    try {
      await api.put('/auth/profile', { password: data.password });
      setSuccess('Password updated successfully');
      setError('');
      toast.success('Password updated successfully');
    } catch (err) {
      const message = err.response?.data.message || 'Failed to update password';
      setError(message);
      setSuccess('');
      toast.error(message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        console.log('Attempting to delete account for user:', user._id);
        const response = await api.delete('/auth/profile');
        console.log('Account deletion response:', response.data);
        logout.mutate(null, {
          onSuccess: () => {
            toast.success('Account deleted successfully');
            navigate('/login', { replace: true });
          },
          onError: () => {
            toast.error('Failed to log out after account deletion');
          },
        });
      } catch (err) {
        console.error('Delete account error:', err.response?.data || err.message);
        const message = err.response?.data.message || 'Failed to delete account';
        toast.error(message);
        setError(message);
      }
    }
  };

  if (!user) return null;

  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=128';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-6 px-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <img src={defaultAvatar} alt="User avatar" className="w-32 h-32 rounded-full mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.username}</h3>
          <p className="text-gray-600 dark:text-gray-300">Role: {user.role}</p>
          {user.googleId && <p className="text-gray-600 dark:text-gray-300">Signed in with Google</p>}
        </div>
        {!user.googleId && (
          <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                New Password (optional)
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="input w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors"
            >
              Update Password
            </button>
          </form>
        )}
        <button
          onClick={handleDeleteAccount}
          className="w-full mt-4 bg-red-500 text-white rounded-md py-2 hover:bg-red-600 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;