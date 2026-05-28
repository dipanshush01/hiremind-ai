import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    const result = await dispatch(register({ name: form.name, email: form.email, password: form.password }));
    if (!result.error) { toast.success('Account created! Welcome to HireMindAI!'); navigate('/dashboard'); }
  };

  const perks = ['Free forever plan', 'AI-powered interviews', 'Live coding environment', 'Detailed analytics'];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center relative">
        {/* Left - Perks */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            <span className="font-bold text-xl">HireMind<span className="text-accent">AI</span></span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">Create a free account and start practicing with our AI interviewer today.</p>
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-text-secondary">
                <CheckCircle size={16} className="text-green flex-shrink-0" />
                {perk}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="bg-surface border border-border rounded-2xl p-8">
            <h2 className="font-bold text-xl mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', icon: User, placeholder: 'John Doe' },
                { label: 'Email', key: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
              ].map(({ label, key, type, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-2 text-text-secondary">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder={placeholder} required />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-bg border border-border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Min 6 characters" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Repeat password" required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader size={16} className="animate-spin" /> Creating account...</> : 'Create Free Account'}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-text-secondary mt-4">
            Already have an account? <Link to="/login" className="text-accent hover:underline font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
