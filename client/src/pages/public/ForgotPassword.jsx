import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Zap, Mail, Loader, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            <span className="font-bold text-xl">HireMind<span className="text-accent">AI</span></span>
          </Link>
          {sent ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green/10 border border-green/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
              <p className="text-text-secondary text-sm">We sent a password reset link to <strong className="text-text-primary">{email}</strong></p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
              <p className="text-text-secondary text-sm">Enter your email and we'll send you a reset link</p>
            </>
          )}
        </div>

        {!sent && (
          <div className="bg-surface border border-border rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="you@example.com" required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader size={16} className="animate-spin" />Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center mt-6">
          <Link to="/login" className="text-sm text-text-secondary hover:text-accent flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
