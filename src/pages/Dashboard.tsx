import { useAuth } from '@/contexts/AuthContext';
import UnifiedDashboard from '@/components/dashboards/UnifiedDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  return <UnifiedDashboard />;
};

export default Dashboard;
