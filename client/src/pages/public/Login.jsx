import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (!result.error) { toast.success('Welcome back!'); navigate('/dashboard'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            <span className="font-bold text-xl">HireMind<span className="text-accent">AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm">Sign in to continue your interview prep</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-secondary">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-secondary">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-bg border border-border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account? <Link to="/register" className="text-accent hover:underline font-semibold">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
}
