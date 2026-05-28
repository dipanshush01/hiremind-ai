import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector(s => s.auth);
  const location = useLocation();

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-bg/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Zap size={16} className="text-accent" />
            </div>
            <span className="font-bold text-lg tracking-tight">HireMind<span className="text-accent">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-text-secondary" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-border md:hidden">
              <div className="px-6 py-4 flex flex-col gap-2">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} className="py-2 text-text-secondary">{link.label}</a>
                ))}
                <Link to="/login" className="py-2 text-text-secondary">Sign In</Link>
                <Link to="/register" className="py-2 px-4 bg-accent text-white rounded-lg text-center font-semibold">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-border mt-24 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-accent" />
            <span className="font-bold">HireMind<span className="text-accent">AI</span></span>
          </div>
          <p className="text-text-muted text-sm font-mono">© 2026 HireMindAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
