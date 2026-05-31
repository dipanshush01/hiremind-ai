import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { Users, FileText, Trophy, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-alt border border-border rounded-xl px-4 py-3 text-xs">
      <p className="text-text-muted font-mono mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
  return null;
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getAdminAnalytics().then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
    </div>
  );

  const s = data?.stats || {};

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-red uppercase tracking-widest flex items-center gap-1">
          <AlertTriangle size={10} /> Admin Panel
        </span>
        <h1 className="text-3xl font-bold mt-2">System Overview</h1>
        <p className="text-text-secondary mt-1 text-sm">Platform-wide metrics and management</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total Users', val: s.totalUsers || 0, color: 'text-accent bg-accent/10 border-accent/20', delay: 0 },
          { icon: FileText, label: 'Total Interviews', val: s.totalInterviews || 0, color: 'text-green bg-green/10 border-green/20', delay: 0.05 },
          { icon: Trophy, label: 'Completed', val: s.completedInterviews || 0, color: 'text-amber bg-amber/10 border-amber/20', delay: 0.1 },
          { icon: TrendingUp, label: 'Avg Score', val: `${s.averageScore || 0}%`, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', delay: 0.15 },
        ].map(({ icon: Icon, label, val, color, delay }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="bg-surface border border-border rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${color}`}><Icon size={16} /></div>
            <div className="text-2xl font-bold">{val}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Interviews by Domain */}
      {data?.interviewsByDomain?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-5">Interviews by Domain</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.interviewsByDomain} barSize={28}>
              <XAxis dataKey="_id" tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Interviews" fill="#5B8AF0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Users */}
      {data?.recentUsers?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-5 flex items-center gap-2"><Activity size={16} className="text-accent" />Recent Signups</h2>
          <div className="space-y-3">
            {data.recentUsers.map((u, i) => (
              <div key={u._id} className="flex items-center justify-between p-3 bg-surface-alt border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-text-muted font-mono">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-text-muted">{format(new Date(u.createdAt), 'MMM d')}</p>
                  <p className="text-xs text-text-secondary">{u.totalInterviews} interviews</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
