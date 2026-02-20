import { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { generateLiveReading } from '@/lib/mock-data';

interface LiveChartProps {
  societyId: string;
  capacity: number;
  isSimulating: boolean;
}

interface DataPoint {
  time: string;
  load: number;
  temperature: number;
}

export function LiveChart({ societyId, capacity, isSimulating }: LiveChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Initialize with some data
    const initial: DataPoint[] = [];
    for (let i = 20; i >= 0; i--) {
      const r = generateLiveReading(societyId, `${societyId}-t1`);
      initial.push({
        time: new Date(Date.now() - i * 5000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        load: r.loadKw,
        temperature: r.temperature,
      });
    }
    setData(initial);
  }, [societyId]);

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        const r = generateLiveReading(societyId, `${societyId}-t1`);
        setData(prev => {
          const next = [...prev, {
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            load: r.loadKw,
            temperature: r.temperature,
          }];
          return next.slice(-30);
        });
      }, 5000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSimulating, societyId]);

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Live Load Monitor</h3>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="flex items-center gap-1.5 text-xs text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LIVE
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">Capacity: {capacity} kW</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
          />
          <Area type="monotone" dataKey="load" stroke="hsl(142, 70%, 45%)" fill="url(#loadGradient)" strokeWidth={2} name="Load (kW)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
