import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Zap, Lock, Loader, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center"><Zap size={18} className="text-accent" /></div>
            <span className="font-bold text-xl">HireMind<span className="text-accent">AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-text-secondary text-sm">Enter your new password below</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{label:'New Password',key:'password'},{label:'Confirm Password',key:'confirm'}].map(({label,key}) => (
              <div key={key}>
                <label className="block text-sm font-semibold mb-2 text-text-secondary">{label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type={showPw?'text':'password'} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    className="w-full bg-bg border border-border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="••••••••" required />
                  {key === 'password' && <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" />Resetting...</> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
