import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Star } from 'lucide-react';

const plans = [
  { name: 'Free', price: 0, desc: 'Perfect for getting started', features: ['3 AI interviews/month','Basic question bank','Text-only answers','Simple analytics','Email support'], cta: 'Get Started', accent: false },
  { name: 'Pro', price: 29, desc: 'For serious job seekers', features: ['Unlimited interviews','All question categories','Video & voice analysis','Live coding rounds','Anti-cheating monitoring','Priority AI feedback','Advanced analytics'], cta: 'Start Pro', accent: true, badge: 'Most Popular' },
  { name: 'Team', price: 99, desc: 'For hiring teams', features: ['Everything in Pro','10 team seats','Candidate management','Custom question banks','Bulk reporting','API access','Dedicated support'], cta: 'Contact Sales', accent: false },
];

export default function Pricing() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent uppercase tracking-widest">Pricing</span>
          <h1 className="text-5xl font-bold mt-3 mb-4">Simple, Transparent <span className="font-serif italic text-text-secondary">Pricing</span></h1>
          <p className="text-text-secondary max-w-md mx-auto">Start free. Upgrade when you need more power.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className={`rounded-2xl p-8 relative ${plan.accent ? 'bg-accent/10 border-2 border-accent' : 'bg-surface border border-border'}`}>
              {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1"><Star size={11} />{plan.badge}</div>}
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-text-muted text-sm">/month</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle size={15} className={plan.accent ? 'text-accent mt-0.5 flex-shrink-0' : 'text-green mt-0.5 flex-shrink-0'} />{f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${plan.accent ? 'bg-accent hover:bg-accent-hover text-white' : 'border border-border hover:border-accent/30 text-text-primary'}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
