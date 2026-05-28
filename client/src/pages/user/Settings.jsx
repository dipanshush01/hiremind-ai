import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setUser } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Save, Loader, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
      <Icon size={18} className="text-accent" />
      <h2 className="font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-2 text-text-secondary">{label}</label>
    {children}
  </div>
);

export default function Settings() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({ name: user?.name || '', skills: user?.skills || [] });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [skillInput, setSkillInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await authAPI.updateProfile({ name: profile.name, skills: profile.skills });
      dispatch(setUser(data.user));
      toast.success('Profile updated!');
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setSavingProfile(false); }
  };

  const savePassword = async () => {
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPw(true);
    try {
      await authAPI.updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to change password'); }
    finally { setSavingPw(false); }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (profile.skills.includes(s)) return toast.error('Skill already added');
    setProfile(p => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (skill) => setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-accent uppercase tracking-widest">Account</span>
        <h1 className="text-3xl font-bold mt-2">Settings</h1>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm text-text-muted font-mono">{user?.email}</p>
              <p className="text-xs text-text-muted mt-1">{user?.totalInterviews || 0} interviews · {user?.averageScore || 0}% avg score</p>
            </div>
          </div>
          <Field label="Full Name">
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
          </Field>
          <Field label="Email">
            <input value={user?.email} disabled className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text-muted cursor-not-allowed" />
          </Field>
          <Field label="Skills">
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="flex-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Add a skill and press Enter..." />
              <button onClick={addSkill} className="px-4 py-2.5 bg-surface-alt border border-border rounded-xl hover:border-accent/30 transition-colors">
                <Plus size={15} className="text-text-secondary" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs font-mono bg-surface-alt border border-border px-2.5 py-1.5 rounded-lg text-text-secondary group">
                  {s}
                  <button onClick={() => removeSkill(s)} className="text-text-muted hover:text-red transition-colors"><X size={11} /></button>
                </span>
              ))}
            </div>
          </Field>
          <button onClick={saveProfile} disabled={savingProfile}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
            {savingProfile ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
            Save Profile
          </button>
        </Section>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Security" icon={Lock}>
          {[
            { label: 'Current Password', key: 'currentPassword', ph: 'Your current password' },
            { label: 'New Password', key: 'newPassword', ph: 'Min 6 characters' },
            { label: 'Confirm New Password', key: 'confirm', ph: 'Repeat new password' },
          ].map(({ label, key, ph }) => (
            <Field key={key} label={label}>
              <input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder={ph} />
            </Field>
          ))}
          <button onClick={savePassword} disabled={savingPw}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
            {savingPw ? <Loader size={15} className="animate-spin" /> : <Shield size={15} />}
            Update Password
          </button>
        </Section>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Account Info" icon={Shield}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Account Status', val: 'Active', color: 'text-green' },
              { label: 'Email Verified', val: user?.isEmailVerified ? 'Yes' : 'No', color: user?.isEmailVerified ? 'text-green' : 'text-amber' },
              { label: 'Role', val: user?.role?.toUpperCase(), color: 'text-accent' },
              { label: 'Member Since', val: user?.createdAt ? new Date(user.createdAt).getFullYear() : '—', color: 'text-text-primary' },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-surface-alt border border-border rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">{label}</p>
                <p className={`font-bold text-sm font-mono ${color}`}>{val}</p>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
