import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startInterview } from '../../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import { Play, Brain, ChevronRight, Loader, Code, Database, Globe, Server, Cpu, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const domains = [
  { id: 'frontend', label: 'Frontend', icon: Globe, desc: 'React, Vue, CSS, JS', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { id: 'backend', label: 'Backend', icon: Server, desc: 'Node.js, Django, APIs', color: 'text-green bg-green/10 border-green/20' },
  { id: 'fullstack', label: 'Full Stack', icon: Layers, desc: 'End-to-end development', color: 'text-accent bg-accent/10 border-accent/20' },
  { id: 'dsa', label: 'DSA', icon: Code, desc: 'Data Structures & Algorithms', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { id: 'database', label: 'Database', icon: Database, desc: 'SQL, MongoDB, Redis', color: 'text-amber bg-amber/10 border-amber/20' },
  { id: 'ml', label: 'Machine Learning', icon: Brain, desc: 'Python, TensorFlow, PyTorch', color: 'text-red bg-red/10 border-red/20' },
  { id: 'devops', label: 'DevOps', icon: Cpu, desc: 'Docker, K8s, CI/CD', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { id: 'system-design', label: 'System Design', icon: Layers, desc: 'Scalability & Architecture', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
];

const difficulties = [
  { id: 'beginner', label: 'Beginner', desc: '0–1 years experience', color: 'border-green text-green bg-green/5' },
  { id: 'intermediate', label: 'Intermediate', desc: '2–4 years experience', color: 'border-amber text-amber bg-amber/5' },
  { id: 'advanced', label: 'Advanced', desc: '5+ years experience', color: 'border-red text-red bg-red/5' },
];

export default function StartInterview() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ domain: '', jobRole: '', difficulty: 'intermediate' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.interview);
  const { user } = useSelector(s => s.auth);

  const handleStart = async () => {
    if (!form.domain) return toast.error('Please select a domain');
    if (!form.jobRole.trim()) return toast.error('Please enter your target job role');
    const result = await dispatch(startInterview(form));
    if (!result.error) {
      toast.success('Interview started! Good luck!');
      navigate(`/dashboard/interview/${result.payload.interview._id}`);
    } else {
      toast.error(result.payload || 'Failed to start interview');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-accent uppercase tracking-widest">New Session</span>
        <h1 className="text-3xl font-bold mt-2">Start AI Interview</h1>
        <p className="text-text-secondary mt-1 text-sm">Configure your interview session below</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Select Domain', 'Configure', 'Launch'].map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${step > i + 1 ? 'text-green' : step === i + 1 ? 'text-accent' : 'text-text-muted'}`}>
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono transition-colors
                ${step > i + 1 ? 'bg-green/10 border-green text-green' : step === i + 1 ? 'bg-accent/10 border-accent text-accent' : 'border-border text-text-muted'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px transition-colors ${step > i + 1 ? 'bg-green/40' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 — Domain */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-bold text-lg mb-4">Choose Your Domain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {domains.map(d => (
              <button key={d.id} onClick={() => setForm({ ...form, domain: d.id })}
                className={`p-4 rounded-2xl border text-left transition-all hover:border-accent/30
                  ${form.domain === d.id ? 'bg-accent/10 border-accent' : 'bg-surface border-border hover:bg-surface-alt'}`}>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${d.color}`}>
                  <d.icon size={16} />
                </div>
                <p className="font-bold text-sm">{d.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{d.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={() => form.domain ? setStep(2) : toast.error('Select a domain')}
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors">
            Continue <ChevronRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Step 2 — Configure */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-bold text-lg mb-4">Configure Interview</h2>
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-secondary">Target Job Role</label>
              <input value={form.jobRole} onChange={e => setForm({ ...form, jobRole: e.target.value })}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Senior React Developer, Full Stack Engineer..." />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-text-secondary">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map(d => (
                  <button key={d.id} onClick={() => setForm({ ...form, difficulty: d.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${form.difficulty === d.id ? d.color : 'border-border bg-surface-alt hover:border-border-hover'}`}>
                    <p className="font-bold text-sm">{d.label}</p>
                    <p className="text-xs text-text-muted mt-1">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {user?.skills?.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">Detected Skills (from resume)</label>
                <div className="flex flex-wrap gap-2">
                  {user.skills.slice(0, 10).map((s, i) => (
                    <span key={i} className="text-xs font-mono bg-surface-alt border border-border px-2.5 py-1 rounded-lg text-text-secondary">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/30 transition-colors">
              Back
            </button>
            <button onClick={() => form.jobRole.trim() ? setStep(3) : toast.error('Enter job role')}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3 — Launch */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-bold text-lg mb-4">Ready to Launch</h2>
          <div className="bg-surface border border-border rounded-2xl p-8 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
              {[
                { label: 'Domain', value: domains.find(d => d.id === form.domain)?.label },
                { label: 'Role', value: form.jobRole },
                { label: 'Level', value: difficulties.find(d => d.id === form.difficulty)?.label },
              ].map(({ label, value }, i) => (
                <div key={i} className="bg-surface-alt rounded-xl p-4 border border-border">
                  <p className="text-xs font-mono text-text-muted mb-1">{label}</p>
                  <p className="font-bold text-sm text-text-primary">{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm text-text-secondary">
              {['8 AI-generated questions tailored to your profile', 'Real-time answer analysis after each response', 'Anti-cheating monitoring is active during interview', 'Complete report emailed to you after finishing'].map((tip, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/30 transition-colors">Back</button>
            <button onClick={handleStart} disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors">
              {loading ? <><Loader size={16} className="animate-spin" />Generating questions...</> : <><Play size={16} />Launch Interview</>}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
