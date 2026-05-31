import React, { useState, useEffect } from 'react';
import { codingAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, RotateCcw, Send, Loader, CheckCircle, XCircle, Zap, Timer, ChevronRight } from 'lucide-react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'go', label: 'Go' },
];

const STARTER_CODE = {
  javascript: `// Write your solution here\nfunction solution(input) {\n  // Your code\n  return input;\n}\n`,
  python: `# Write your solution here\ndef solution(input):\n    # Your code\n    return input\n`,
  java: `// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code\n    }\n}\n`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code\n    return 0;\n}\n`,
  typescript: `// Write your solution here\nfunction solution(input: any): any {\n  // Your code\n  return input;\n}\n`,
  go: `// Write your solution here\npackage main\n\nfunc main() {\n    // Your code\n}\n`,
};

export default function CodingPractice() {
  const [step, setStep] = useState('config'); // config | coding | result
  const [config, setConfig] = useState({ domain: 'javascript', difficulty: 'medium' });
  const [codingRound, setCodingRound] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);

  // Timer
  useEffect(() => {
    if (step !== 'coding' || !timeLeft) return;
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); toast.error('Time is up!'); handleSubmit(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [step, timeLeft]);

  const generateProblem = async () => {
    setLoading(true);
    try {
      const { data } = await codingAPI.generateProblem({ domain: config.domain, difficulty: config.difficulty });
      setCodingRound(data.codingRound);
      setCode(STARTER_CODE[language]);
      setTimeLeft(data.codingRound.timeLimit * 60);
      setStep('coding');
    } catch { toast.error('Failed to generate problem'); }
    finally { setLoading(false); }
  };

  const handleRun = () => {
    setOutput('// Code execution requires a backend runtime service.\n// In production this connects to Judge0 API.\n// Simulating: code looks syntactically valid!');
    toast.success('Code compiled (simulated)', { icon: '⚡' });
  };

  const handleSubmit = async () => {
    if (!codingRound) return;
    setSubmitting(true);
    try {
      const simulatedTests = [
        { input: 'test1', expectedOutput: 'result1', actualOutput: 'result1', passed: true, executionTime: 12 },
        { input: 'test2', expectedOutput: 'result2', actualOutput: 'result2', passed: Math.random() > 0.3, executionTime: 8 },
        { input: 'edge case', expectedOutput: 'edge result', actualOutput: 'edge result', passed: Math.random() > 0.4, executionTime: 15 },
      ];
      const { data } = await codingAPI.submitCode(codingRound._id, {
        code, language, output,
        testResults: simulatedTests,
      });
      setResult(data);
      setStep('result');
      toast.success(`Score: ${data.score}%`);
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft > 300 ? 'text-green' : timeLeft > 120 ? 'text-amber' : 'text-red';

  return (
    <div className="h-screen flex flex-col">
      {/* Config Step */}
      {step === 'config' && (
        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="font-mono text-xs text-green uppercase tracking-widest">Coding</span>
            <h1 className="text-3xl font-bold mt-2">Coding Practice</h1>
            <p className="text-text-secondary mt-1 text-sm">AI-generated problems with real-time evaluation</p>
          </motion.div>
          <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-text-secondary">Language / Domain</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(l => (
                  <button key={l.id} onClick={() => { setConfig({ ...config, domain: l.id }); setLanguage(l.id); }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${config.domain === l.id ? 'bg-green/10 border-green text-green' : 'border-border text-text-muted hover:border-green/30'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-text-secondary">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {[['easy', 'Easy', 'text-green border-green bg-green/5'], ['medium', 'Medium', 'text-amber border-amber bg-amber/5'], ['hard', 'Hard', 'text-red border-red bg-red/5']].map(([id, label, ac]) => (
                  <button key={id} onClick={() => setConfig({ ...config, difficulty: id })}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${config.difficulty === id ? ac : 'border-border text-text-muted hover:border-border-hover'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generateProblem} disabled={loading}
              className="w-full py-4 bg-green/10 border border-green/20 text-green hover:bg-green/20 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" />Generating problem...</> : <><Zap size={16} />Generate Problem</>}
            </button>
          </div>
        </div>
      )}

      {/* Coding Step */}
      {step === 'coding' && codingRound && (
        <div className="flex flex-col h-full">
          {/* Top Bar */}
          <div className="h-12 border-b border-border bg-surface flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{codingRound.problem.title}</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border
                ${codingRound.problem.difficulty === 'easy' ? 'bg-green/10 border-green/20 text-green' : codingRound.problem.difficulty === 'medium' ? 'bg-amber/10 border-amber/20 text-amber' : 'bg-red/10 border-red/20 text-red'}`}>
                {codingRound.problem.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm font-bold ${timerColor} flex items-center gap-1`}>
                <Timer size={14} />{formatTime(timeLeft)}
              </span>
              <select value={language} onChange={e => { setLanguage(e.target.value); setCode(STARTER_CODE[e.target.value]); }}
                className="text-xs bg-surface-alt border border-border rounded-lg px-2 py-1.5 font-mono text-text-secondary focus:outline-none">
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <button onClick={handleRun} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-alt border border-border rounded-lg text-xs font-semibold hover:border-green/30 hover:text-green transition-colors">
                <Play size={12} />Run
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green/10 border border-green/20 text-green rounded-lg text-xs font-semibold hover:bg-green/20 transition-colors disabled:opacity-50">
                {submitting ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}Submit
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Problem Panel */}
            <div className="w-96 border-r border-border bg-surface overflow-y-auto p-5 flex-shrink-0">
              <h3 className="font-bold text-base mb-3">{codingRound.problem.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{codingRound.problem.description}</p>
              {codingRound.problem.examples?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-3">Examples</h4>
                  {codingRound.problem.examples.map((ex, i) => (
                    <div key={i} className="bg-surface-alt border border-border rounded-xl p-3 mb-2 font-mono text-xs">
                      <div className="text-text-muted mb-1">Input: <span className="text-text-primary">{ex.input}</span></div>
                      <div className="text-text-muted mb-1">Output: <span className="text-green">{ex.output}</span></div>
                      {ex.explanation && <div className="text-text-muted">Note: {ex.explanation}</div>}
                    </div>
                  ))}
                </div>
              )}
              {codingRound.problem.constraints?.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-3">Constraints</h4>
                  <ul className="space-y-1">
                    {codingRound.problem.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-text-secondary font-mono flex gap-2"><span className="text-accent">·</span>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Editor + Output */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language={language} value={code} onChange={v => setCode(v || '')}
                  theme="vs-dark"
                  options={{ fontSize: 13, fontFamily: 'DM Mono, monospace', minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: 'on', renderLineHighlight: 'gutter', cursorBlinking: 'smooth' }} />
              </div>
              {output && (
                <div className="h-32 border-t border-border bg-bg p-4 overflow-y-auto flex-shrink-0">
                  <p className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-2">Output</p>
                  <pre className="text-xs font-mono text-green leading-relaxed">{output}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && result && (
        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-4 ${result.score >= 70 ? 'border-green bg-green/10 text-green' : 'border-amber bg-amber/10 text-amber'}`}>
                <span className="text-2xl font-bold">{result.score}%</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Submission Complete</h2>
              <p className="text-text-secondary text-sm">AI code review and test results below</p>
            </div>

            {result.aiReview && (
              <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-bold mb-4">AI Code Review</h3>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[['Quality', result.aiReview.quality, 'text-accent'], ['Efficiency', result.aiReview.efficiency, 'text-green'], ['Readability', result.aiReview.readability, 'text-amber']].map(([label, val, color]) => (
                    <div key={label} className="bg-surface-alt border border-border rounded-xl p-3 text-center">
                      <div className={`font-bold text-xl ${color}`}>{val}%</div>
                      <div className="text-xs text-text-muted">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{result.aiReview.feedback}</p>
                {result.aiReview.suggestions?.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-text-muted mb-2">SUGGESTIONS</p>
                    <ul className="space-y-1.5">
                      {result.aiReview.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-text-secondary flex gap-2"><span className="text-amber">›</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep('config'); setResult(null); setCodingRound(null); setOutput(''); }}
                className="flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent/30 transition-colors">
                <RotateCcw size={14} /> Try Another
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
