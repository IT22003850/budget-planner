import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log('PrivateRoute check, user:', !!user);
  return user ? children : <Navigate to="/login" state={{ error: 'Please log in to access this page' }} replace />;
};

export default PrivateRoute;