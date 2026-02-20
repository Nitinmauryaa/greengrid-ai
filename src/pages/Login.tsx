import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Zap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 glow-green">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient-green">GreenGrid</h1>
          <p className="text-muted-foreground mt-2 text-sm">AI-Powered Energy Optimization Platform</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 glow-green">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="owner@greengrid.io"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
              />
            </div>
            {error && <p className="text-xs text-critical">{error}</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-1.5 text-xs font-mono">
              <p className="text-muted-foreground"><span className="text-primary">Owner:</span> owner@greengrid.io / owner123</p>
              <p className="text-muted-foreground"><span className="text-warning">Admin:</span> admin@greengrid.io / admin123</p>
              <p className="text-muted-foreground"><span className="text-accent-foreground">Resident:</span> resident@greengrid.io / resident123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
