import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { get24HourData } from '@/lib/mock-data';
import { useMemo } from 'react';

export function LoadHistoryChart({ societyId }: { societyId: string }) {
  const data = useMemo(() => 
    get24HourData(societyId).map(d => ({
      hour: `${d.hour}:00`,
      load: Math.round(d.loadKw),
      ev: d.evCharging ? 30 : 0,
    }))
  , [societyId]);

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">24-Hour Load History</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="load" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Load (kW)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
