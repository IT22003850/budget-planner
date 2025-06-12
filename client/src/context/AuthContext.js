import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => {
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Token found in URL:', urlToken);
      try {
        localStorage.setItem('token', urlToken);
        // Clear query params to prevent re-processing
        navigate('/dashboard', { replace: true });
        return urlToken;
      } catch (err) {
        console.error('Error storing token:', err);
        return null;
      }
    }
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    return token;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        console.log('No token found, setting user to null');
        setUser(null);
        setLoading(false);
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login', { replace: true, state: { error: 'Please log in' } });
        }
        return;
      }

      try {
        console.log('Fetching user with token');
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User fetched successfully:', response.data);
        setUser(response.data);
        if (location.pathname === '/login' || location.pathname === '/register') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error.response?.status, error.response?.data);
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login', { replace: true, state: { error: 'Invalid or expired session' } });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location.pathname, navigate]);

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};