import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, AlertCircle, CheckCircle, ChevronDown, ChevronUp, BarChart3, Clock, Download, Play } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const ScoreBadge = ({ score }) => {
  const color = score >= 75 ? 'text-green border-green bg-green/10' : score >= 50 ? 'text-amber border-amber bg-amber/10' : 'text-red border-red bg-red/10';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  return (
    <div className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${color}`}>
      <span className="text-3xl font-bold">{score}%</span>
      <span className="text-xs font-mono">{label}</span>
    </div>
  );
};

export default function InterviewReport() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.get(id).then(({ data }) => {
      setInterview(data.interview);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!interview) return null;

  const radarData = interview.answers.slice(0, 5).map((a, i) => ({
    question: `Q${i + 1}`,
    score: (a.score || 0) * 10,
    confidence: a.aiAnalysis?.confidence || 0,
    clarity: a.aiAnalysis?.clarity || 0,
  }));

  const avgConfidence = Math.round(interview.answers.reduce((s, a) => s + (a.aiAnalysis?.confidence || 0), 0) / (interview.answers.length || 1));
  const avgClarity = Math.round(interview.answers.reduce((s, a) => s + (a.aiAnalysis?.clarity || 0), 0) / (interview.answers.length || 1));
  const avgAccuracy = Math.round(interview.answers.reduce((s, a) => s + (a.aiAnalysis?.technicalAccuracy || 0), 0) / (interview.answers.length || 1));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
        <div>
          <span className="font-mono text-xs text-accent uppercase tracking-widest">Interview Complete</span>
          <h1 className="text-3xl font-bold mt-2">{interview.jobRole} Report</h1>
          <p className="text-text-secondary text-sm mt-1 font-mono">{interview.domain} · {interview.difficulty} · {interview.duration}min</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/start-interview"
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-sm font-semibold rounded-xl hover:bg-accent/20 transition-colors">
            <Play size={14} /> Retry
          </Link>
        </div>
      </motion.div>

      {/* Score Hero */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-surface border border-border rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-center gap-8">
        <ScoreBadge score={interview.percentageScore} />
        <div className="flex-1">
          <h2 className="font-bold text-xl mb-3">Overall Assessment</h2>
          <p className="text-text-secondary leading-relaxed text-sm mb-5">{interview.overallFeedback || 'Interview completed. See breakdown below.'}</p>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Confidence', val: avgConfidence, color: 'text-accent' },
              { label: 'Clarity', val: avgClarity, color: 'text-green' },
              { label: 'Accuracy', val: avgAccuracy, color: 'text-amber' }].map(({ label, val, color }) => (
              <div key={label} className="bg-surface-alt border border-border rounded-xl p-3 text-center">
                <div className={`font-bold text-xl ${color}`}>{val}%</div>
                <div className="text-xs text-text-muted">{label}</div>
                <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-green" />
            <h3 className="font-bold">Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {(interview.strengths || ['Good technical foundation', 'Clear communication']).map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
                <span className="text-green flex-shrink-0 mt-0.5">›</span>{s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-amber" />
            <h3 className="font-bold">Areas to Improve</h3>
          </div>
          <ul className="space-y-2.5">
            {(interview.improvements || ['Deepen system design knowledge', 'Practice more complex algorithms']).map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
                <span className="text-amber flex-shrink-0 mt-0.5">›</span>{s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-accent" /> Performance Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1C2030" />
              <PolarAngleAxis dataKey="question" tick={{ fill: '#7A8699', fontSize: 12, fontFamily: 'DM Mono' }} />
              <Radar name="Score" dataKey="score" stroke="#5B8AF0" fill="#5B8AF0" fillOpacity={0.15} />
              <Radar name="Confidence" dataKey="confidence" stroke="#20D472" fill="#20D472" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Q&A Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="font-bold mb-4">Question-by-Question Breakdown</h3>
        <div className="space-y-3">
          {interview.answers.map((a, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-alt transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-text-muted flex-shrink-0">Q{i + 1}</span>
                  <span className="text-sm font-medium truncate">{a.questionText}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className={`font-bold text-sm ${a.score >= 7 ? 'text-green' : a.score >= 5 ? 'text-amber' : 'text-red'}`}>
                    {a.score}/10
                  </span>
                  {expanded === i ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
                </div>
              </button>
              {expanded === i && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="mt-4 mb-3">
                    <p className="text-xs font-mono text-text-muted mb-1">Your Answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed bg-surface-alt rounded-xl p-3">{a.answerText}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-mono text-text-muted mb-1">AI Feedback</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{a.feedback}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Confidence', val: a.aiAnalysis?.confidence },
                      { label: 'Clarity', val: a.aiAnalysis?.clarity },
                      { label: 'Accuracy', val: a.aiAnalysis?.technicalAccuracy },
                      { label: 'Grammar', val: a.aiAnalysis?.grammarScore },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-bg border border-border rounded-lg p-2 text-center">
                        <div className="text-accent font-bold text-sm">{val || 0}%</div>
                        <div className="text-xs text-text-muted">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Anti-cheat summary */}
      {interview.antiCheating?.flagged && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-6 bg-amber/5 border border-amber/20 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber text-sm">Integrity Notice</p>
            <p className="text-xs text-text-muted mt-0.5">
              {interview.antiCheating.tabSwitches} tab switches · {interview.antiCheating.copyPasteAttempts} paste attempts detected
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Link to="/dashboard/interviews" className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/30 transition-colors">
          All Interviews
        </Link>
        <Link to="/dashboard/start-interview"
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors">
          <Play size={15} /> Practice Again
        </Link>
      </div>
    </div>
  );
}
