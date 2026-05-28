import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Brain, Code, Shield, BarChart3, Video, ArrowRight, Star, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }} viewport={{ once: true }}
    className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/30 hover:bg-surface-alt transition-all group">
    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 transition-colors ${color}`}>
      <Icon size={20} />
    </div>
    <h3 className="font-bold text-lg mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const StatCard = ({ value, label, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }} viewport={{ once: true }}
    className="text-center">
    <div className="font-serif text-5xl font-bold text-accent mb-2">{value}</div>
    <div className="text-text-secondary text-sm font-mono">{label}</div>
  </motion.div>
);

export default function Home() {
  const features = [
    { icon: Brain, title: 'AI-Powered Questions', desc: 'Adaptive questions generated from your resume and job role in real-time.', color: 'bg-accent/10 border-accent/20 text-accent', delay: 0.1 },
    { icon: Video, title: 'Live Video Analysis', desc: 'Real-time emotion detection, eye contact, and confidence scoring via webcam.', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400', delay: 0.15 },
    { icon: Code, title: 'Live Coding Rounds', desc: 'Full IDE environment with 40+ languages, auto-test execution, and AI code review.', color: 'bg-green/10 border-green/20 text-green', delay: 0.2 },
    { icon: Shield, title: 'Anti-Cheating System', desc: 'Detects tab switches, multiple faces, and suspicious behavior automatically.', color: 'bg-amber/10 border-amber/20 text-amber', delay: 0.25 },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Track progress, identify weak areas, and see improvement over time.', color: 'bg-red/10 border-red/20 text-red', delay: 0.3 },
    { icon: Zap, title: 'Instant Reports', desc: 'Detailed AI feedback report delivered to your inbox within seconds.', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400', delay: 0.35 },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-green/5 blur-2xl" />
          <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(91,138,240,0.08) 1px, transparent 0)',backgroundSize:'48px 48px'}} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-mono px-4 py-2 rounded-full mb-8">
            <Zap size={12} />
            Powered by GPT-4 · Real-time AI Evaluation
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="text-6xl md:text-8xl font-bold leading-none mb-6 tracking-tight">
            Ace Every
            <span className="block font-serif italic text-accent">Interview</span>
            With AI
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice with an AI interviewer that adapts to your resume, evaluates your answers in real-time, and gives you actionable feedback to land your dream job.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 group">
              Start Free Interview
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/pricing"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-accent/30 text-text-secondary hover:text-text-primary font-semibold rounded-xl transition-all">
              View Pricing
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mt-10 text-sm text-text-muted font-mono">
            {['No credit card needed', 'Free forever plan', '10,000+ users'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-green" />{item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatCard value="50K+" label="Interviews Conducted" delay={0} />
          <StatCard value="94%" label="User Satisfaction" delay={0.1} />
          <StatCard value="40+" label="Languages Supported" delay={0.2} />
          <StatCard value="3×" label="Faster Interview Prep" delay={0.3} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Everything You Need<br /><span className="font-serif italic text-text-secondary">to Get Hired</span></h2>
            <p className="text-text-secondary max-w-xl mx-auto">From resume analysis to live coding rounds — a complete interview preparation ecosystem.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-surface border border-border rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-green/5 pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4">Ready to Ace Your Interview?</h2>
            <p className="text-text-secondary mb-8">Join thousands of candidates who landed their dream jobs with HireMindAI.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
