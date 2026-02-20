import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Zap, LogOut, LayoutDashboard, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) return <Navigate to="/login" />;

  const roleLabel = user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Resident';
  const roleColor = user.role === 'owner' ? 'text-primary' : user.role === 'admin' ? 'text-warning' : 'text-accent-foreground';

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-gradient-green">GreenGrid</span>
            </Link>
            <span className="text-xs text-muted-foreground hidden sm:block">|</span>
            <span className={`text-xs font-semibold ${roleColor} hidden sm:block`}>{roleLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); }} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
