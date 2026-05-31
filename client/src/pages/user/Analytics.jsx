import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Flame, Trophy, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#5B8AF0', '#20D472', '#F0A832', '#F05050', '#A78BFA'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-alt border border-border rounded-xl px-4 py-3 text-xs">
      <p className="text-text-muted font-mono mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}{p.name === 'Score' ? '%' : ''}</p>)}
    </div>
  );
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getUserAnalytics().then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
    </div>
  );

  const stats = data?.analytics || {};
  const chartData = data?.recentInterviews?.slice().reverse().map((iv, i) => ({
    name: `#${i + 1}`, score: iv.percentageScore, domain: iv.domain, duration: iv.duration
  })) || [];

  const domainData = (data?.domainPerformance || []).map(d => ({ name: d.domain, score: d.averageScore, count: d.attempts }));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-accent uppercase tracking-widest">Insights</span>
        <h1 className="text-3xl font-bold mt-2">Your Analytics</h1>
        <p className="text-text-secondary mt-1 text-sm">Track performance trends and identify growth areas</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Target, label: 'Total Interviews', val: stats.totalInterviews || 0, color: 'text-accent bg-accent/10 border-accent/20', delay: 0 },
          { icon: Trophy, label: 'Best Score', val: `${stats.bestScore || 0}%`, color: 'text-amber bg-amber/10 border-amber/20', delay: 0.05 },
          { icon: TrendingUp, label: 'Avg Score', val: `${stats.averageScore || 0}%`, color: 'text-green bg-green/10 border-green/20', delay: 0.1 },
          { icon: Flame, label: 'Streak', val: `${stats.streak || 0}d`, color: 'text-red bg-red/10 border-red/20', delay: 0.15 },
        ].map(({ icon: Icon, label, val, color, delay }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="bg-surface border border-border rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
              <Icon size={16} />
            </div>
            <div className="text-2xl font-bold">{val}</div>
            <div className="text-xs text-text-muted mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Score Over Time */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-1">Score Trend</h2>
          <p className="text-xs font-mono text-text-muted mb-5">Last {chartData.length} interviews</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#5B8AF0" strokeWidth={2.5} dot={{ fill: '#5B8AF0', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">Complete interviews to see trends</div>
          )}
        </motion.div>

        {/* Skill Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-5">AI Score Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Technical Accuracy', val: stats.technicalScore || 0, color: 'text-accent bg-accent' },
              { label: 'Communication', val: stats.communicationScore || 0, color: 'text-green bg-green' },
              { label: 'Confidence', val: stats.confidenceScore || 0, color: 'text-amber bg-amber' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-text-secondary">{label}</span>
                  <span className={`text-xs font-mono font-bold ${color.split(' ')[0]}`}>{val}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${color.split(' ')[1]}`}
                    initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Domain Distribution */}
          {domainData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">By Domain</h3>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={domainData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={30}>
                    {domainData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {domainData.map((d, i) => (
                  <span key={i} className="text-xs font-mono flex items-center gap-1 text-text-muted">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Domain Performance */}
      {domainData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-1">Domain Performance</h2>
          <p className="text-xs font-mono text-text-muted mb-5">Average scores by technology domain</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={domainData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Score" fill="#5B8AF0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Weak / Strong Topics */}
      {(stats.weakTopics?.length > 0 || stats.strongTopics?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {stats.strongTopics?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Trophy size={16} className="text-green" />Strong Topics</h3>
              <div className="flex flex-wrap gap-2">
                {stats.strongTopics.map((t, i) => <span key={i} className="text-xs font-mono bg-green/10 border border-green/20 text-green px-2.5 py-1 rounded-lg">{t}</span>)}
              </div>
            </motion.div>
          )}
          {stats.weakTopics?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={16} className="text-amber" />Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {stats.weakTopics.map((t, i) => <span key={i} className="text-xs font-mono bg-amber/10 border border-amber/20 text-amber px-2.5 py-1 rounded-lg">{t}</span>)}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
