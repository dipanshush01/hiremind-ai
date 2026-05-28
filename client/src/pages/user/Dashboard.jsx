import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../../services/api';
import { Play, BarChart3, Trophy, Clock, TrendingUp, Code, Upload, ArrowRight, Zap, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/20 transition-colors">
    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
      <Icon size={18} />
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-text-secondary">{label}</div>
    {sub && <div className="text-xs text-text-muted font-mono mt-1">{sub}</div>}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-surface-alt border border-border rounded-xl px-4 py-3">
      <p className="text-xs text-text-muted font-mono mb-1">{label}</p>
      <p className="text-sm font-bold text-accent">{payload[0].value}% score</p>
    </div>
  );
  return null;
};

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getUserAnalytics().then(({ data }) => {
      setAnalytics(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const chartData = analytics?.recentInterviews?.slice().reverse().map((iv, i) => ({
    name: `#${i + 1}`,
    score: iv.percentageScore,
    domain: iv.domain,
  })) || [];

  const quickActions = [
    { to: '/dashboard/start-interview', icon: Play, label: 'Start Interview', desc: 'AI-powered mock interview', color: 'bg-accent/10 border-accent/20 text-accent' },
    { to: '/dashboard/coding', icon: Code, label: 'Coding Practice', desc: 'Live coding problems', color: 'bg-green/10 border-green/20 text-green' },
    { to: '/dashboard/resume', icon: Upload, label: 'Upload Resume', desc: 'Get AI resume analysis', color: 'bg-amber/10 border-amber/20 text-amber' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Track your progress', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-mono text-text-muted">Welcome back</span>
          <Zap size={14} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold">{user?.name?.split(' ')[0]}<span className="text-text-secondary font-normal">'s Dashboard</span></h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Target} label="Total Interviews" value={loading ? '—' : analytics?.analytics?.totalInterviews || 0} color="bg-accent/10 border-accent/20 text-accent" delay={0} />
        <StatCard icon={Trophy} label="Best Score" value={loading ? '—' : `${analytics?.analytics?.bestScore || 0}%`} color="bg-amber/10 border-amber/20 text-amber" delay={0.05} />
        <StatCard icon={TrendingUp} label="Avg Score" value={loading ? '—' : `${analytics?.analytics?.averageScore || 0}%`} color="bg-green/10 border-green/20 text-green" delay={0.1} />
        <StatCard icon={Clock} label="Streak" value={loading ? '—' : `${analytics?.analytics?.streak || 0}d`} sub="Keep it up!" color="bg-purple-500/10 border-purple-500/20 text-purple-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-lg">Score Progress</h2>
              <p className="text-sm text-text-muted font-mono">Last {chartData.length} interviews</p>
            </div>
            <Link to="/dashboard/analytics" className="text-accent text-sm flex items-center gap-1 hover:underline">
              Full analytics <ArrowRight size={13} />
            </Link>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#404858', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#5B8AF0" strokeWidth={2} dot={{ fill: '#5B8AF0', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No interviews yet. <Link to="/dashboard/start-interview" className="text-accent hover:underline">Start one now!</Link></p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Your Skills</h2>
          {user?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 12).map((skill, i) => (
                <span key={i} className="text-xs font-mono bg-surface-alt border border-border px-2.5 py-1 rounded-lg text-text-secondary">
                  {skill}
                </span>
              ))}
              {user.skills.length > 12 && <span className="text-xs text-text-muted font-mono">+{user.skills.length - 12} more</span>}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-text-muted mb-3">Upload your resume to auto-detect skills</p>
              <Link to="/dashboard/resume" className="text-accent text-sm hover:underline flex items-center justify-center gap-1">
                <Upload size={13} /> Upload Resume
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ to, icon: Icon, label, desc, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <Link to={to} className="block bg-surface border border-border rounded-2xl p-5 hover:border-accent/20 hover:bg-surface-alt transition-all group">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="font-bold text-sm mb-1 group-hover:text-accent transition-colors">{label}</p>
                <p className="text-xs text-text-muted">{desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
