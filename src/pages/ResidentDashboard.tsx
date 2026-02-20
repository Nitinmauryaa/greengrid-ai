import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { get24HourData, getCarbonMetrics } from '@/lib/mock-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoadHistoryChart } from '@/components/dashboard/LoadHistoryChart';
import { CarbonIntelligence } from '@/components/dashboard/CarbonIntelligence';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, IndianRupee, Clock, Bell, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const societyId = user?.societyId || 's1';

  const data = useMemo(() => get24HourData(societyId), [societyId]);
  
  const avgLoad = data.reduce((s, d) => s + d.loadKw, 0) / data.length;
  const peakLoad = Math.max(...data.map(d => d.loadKw));
  const peakHour = data.find(d => d.loadKw === peakLoad)?.hour ?? 0;
  const estimatedBill = avgLoad * 24 * 30 * 0.08 / 1000; // rough estimate in ₹K
  const savings = estimatedBill * 0.12;

  const personalData = data.map(d => ({
    hour: `${d.hour}:00`,
    usage: Math.round(d.loadKw * 0.012), // per-flat fraction
  }));

  const notifications = [
    { id: 1, text: 'Peak hours detected: 18:00-21:00. Shift heavy loads if possible.', type: 'warning' as const, time: '2 min ago' },
    { id: 2, text: 'Your usage is 8% below society average. Great job!', type: 'success' as const, time: '1 hour ago' },
    { id: 3, text: 'EV charging slot available: 02:00-05:00 (off-peak rates)', type: 'info' as const, time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Flat {user?.flatNumber || 'A-204'} • Personal Energy Overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Avg Usage" value={`${(avgLoad * 0.012).toFixed(1)}`} icon={Zap} subtitle="kW today" />
        <StatCard title="Peak Load" value={`${(peakLoad * 0.012).toFixed(1)}`} icon={Clock} subtitle={`at ${peakHour}:00`} />
        <StatCard title="Est. Bill" value={`₹${(estimatedBill * 100).toFixed(0)}`} icon={IndianRupee} subtitle="this month" />
        <StatCard title="Savings" value={`₹${(savings * 100).toFixed(0)}`} icon={Zap} subtitle="vs last month" trend={{ value: 12, positive: true }} />
      </div>

      {/* Personal usage chart */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Your 24-Hour Usage</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={personalData}>
            <defs>
              <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="usage" stroke="hsl(142, 70%, 45%)" fill="url(#usageGrad)" strokeWidth={2} name="Usage (kW)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Peak time recommendation */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Peak Time Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-critical/10 border border-critical/20">
            <p className="text-xs font-semibold text-critical">Avoid: 18:00 - 21:00</p>
            <p className="text-xs text-muted-foreground mt-1">Peak grid demand period</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs font-semibold text-warning">Moderate: 09:00 - 17:00</p>
            <p className="text-xs text-muted-foreground mt-1">Standard rate applies</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-semibold text-primary">Best: 00:00 - 06:00</p>
            <p className="text-xs text-muted-foreground mt-1">Off-peak lowest rates</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
        </div>
        <div className="space-y-3">
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                n.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                n.type === 'success' ? 'bg-primary/5 border-primary/20' :
                'bg-secondary border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">{n.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{n.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CarbonIntelligence societyId={societyId} />
    </div>
  );
};

export default ResidentDashboard;
