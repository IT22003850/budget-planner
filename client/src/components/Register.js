import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
      className="container flex justify-center items-center min-h-screen py-10"
    >
      <div className="card p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[var(--foreground)]">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block font-medium mb-2 text-[var(--foreground)]">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="input"
              autoComplete="username"
              disabled={isSubmitting}
            />
            {errors.username && <p className="text-[var(--danger)] text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-2 text-[var(--foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="input"
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-[var(--danger)] text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-2 text-[var(--foreground)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="input"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-[var(--danger)] text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-2 text-[var(--foreground)]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="input"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-[var(--danger)] text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="button btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-[var(--foreground)]">
          Already have an account? <Link to="/login" className="text-[var(--primary)] hover:underline">Login</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;