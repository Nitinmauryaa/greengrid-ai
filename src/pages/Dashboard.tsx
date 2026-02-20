import { useAuth } from '@/contexts/AuthContext';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';
import ResidentDashboard from './ResidentDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'owner': return <OwnerDashboard />;
    case 'admin': return <AdminDashboard />;
    case 'resident': return <ResidentDashboard />;
    default: return <Navigate to="/login" />;
  }
};

export default Dashboard;
