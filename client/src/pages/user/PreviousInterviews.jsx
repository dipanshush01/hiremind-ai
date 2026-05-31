import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInterviews } from '../../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import { FileText, Clock, Trophy, ChevronRight, Play, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const styles = { completed: 'bg-green/10 border-green/20 text-green', 'in-progress': 'bg-accent/10 border-accent/20 text-accent', abandoned: 'bg-red/10 border-red/20 text-red', pending: 'bg-border text-text-muted' };
  return <span className={`text-xs font-mono px-2 py-0.5 rounded border ${styles[status] || styles.pending}`}>{status}</span>;
};

export default function PreviousInterviews() {
  const dispatch = useDispatch();
  const { interviews, pagination, loading } = useSelector(s => s.interview);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchUserInterviews(page)); }, [dispatch, page]);

  const filtered = interviews.filter(i => {
    const matchSearch = i.domain?.toLowerCase().includes(search.toLowerCase()) || i.jobRole?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || i.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-accent uppercase tracking-widest">History</span>
        <h1 className="text-3xl font-bold mt-2">My Interviews</h1>
        <p className="text-text-secondary mt-1 text-sm">Track your progress and review past sessions</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
            placeholder="Search by domain or role..." />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'in-progress', 'abandoned'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-colors capitalize
                ${filter === f ? 'bg-accent/10 border border-accent/20 text-accent' : 'border border-border text-text-muted hover:border-accent/20'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={40} className="mx-auto mb-4 text-text-muted opacity-40" />
          <p className="text-text-secondary mb-4">No interviews found</p>
          <Link to="/dashboard/start-interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors text-sm">
            <Play size={14} /> Start Your First Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((iv, i) => (
            <motion.div key={iv._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/20 hover:bg-surface-alt transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono
                    ${iv.percentageScore >= 75 ? 'bg-green/10 border-green/20 text-green' : iv.percentageScore >= 50 ? 'bg-amber/10 border-amber/20 text-amber' : iv.status === 'completed' ? 'bg-red/10 border-red/20 text-red' : 'bg-surface-alt border-border text-text-muted'}`}>
                    {iv.status === 'completed' ? `${iv.percentageScore}%` : '—'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">{iv.jobRole || 'Interview Session'}</p>
                      <StatusBadge status={iv.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted font-mono">
                      <span>{iv.domain}</span>
                      <span>·</span>
                      <span>{iv.difficulty}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{iv.duration || 0}min</span>
                      <span>·</span>
                      <span>{format(new Date(iv.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                {iv.status === 'completed' && (
                  <Link to={`/dashboard/interview/${iv._id}/report`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-surface-alt border border-border rounded-xl text-xs font-semibold hover:border-accent/30 hover:text-accent transition-colors flex-shrink-0">
                    Report <ChevronRight size={13} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-mono font-bold transition-colors ${page === i + 1 ? 'bg-accent text-white' : 'border border-border text-text-muted hover:border-accent/30'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
