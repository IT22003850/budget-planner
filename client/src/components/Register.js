import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-md mx-auto py-10"
    >
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`input w-full ${errors.username ? 'border-red-500' : ''}`}
              autoComplete="username"
              disabled={isSubmitting}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;