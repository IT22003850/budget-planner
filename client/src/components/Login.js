import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errorFromRedirect = location.state?.error;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user && location.pathname === '/login') {
      console.log('User authenticated, redirecting to /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, location.pathname]);

  const onSubmit = async (data) => {
    console.log('Attempting login with:', data);
    login.mutate(data, {
      onSuccess: () => {
        console.log('Login successful, showing toast');
        toast.success('Logged in successfully');
      },
      onError: (err) => {
        console.error('Login error:', err);
        toast.error(err.response?.data.message || 'Login failed');
      },
    });
  };

  const handleGoogleLogin = () => {
    console.log('Initiating Google login');
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container flex justify-center items-center min-h-screen py-10"
    >
      <div className="card p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-[var(--foreground)]">Login</h2>
        {errorFromRedirect && <p className="text-[var(--danger)] text-center mb-6">{errorFromRedirect}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block font-medium mb-2 text-[var(--foreground)]">
              Username
            </label>
            <input
              id="username"
              {...register('username')}
              className="input"
              placeholder="Enter username"
              autoComplete="username"
            />
            {errors.username && <p className="text-[var(--danger)] text-sm mt-1">{errors.username.message}</p>}
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
              placeholder="Enter password"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-[var(--danger)] text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="button btn-primary w-full"
            disabled={login.isLoading}
          >
            {login.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="button btn-danger w-full mt-4"
          disabled={login.isLoading}
        >
          Login with Google
        </button>
        <p className="mt-6 text-center text-[var(--foreground)]">
          Don't have an account? <Link to="/register" className="text-[var(--primary)] hover:underline">Register</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;