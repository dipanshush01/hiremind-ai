import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { endInterview } from '../../redux/slices/interviewSlice';
import { interviewAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Send, ChevronRight, Loader, Mic, MicOff, Camera, CameraOff, CheckCircle, Brain } from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const webcamRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState([]); // indices of answered questions
  const [timeLeft, setTimeLeft] = useState(120); // 2 min per question
  const [totalTime, setTotalTime] = useState(0);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cheatingFlags, setCheatingFlags] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);

  // Load interview
  useEffect(() => {
    interviewAPI.get(id).then(({ data }) => {
      setInterview(data.interview);
      setLoading(false);
    }).catch(() => { toast.error('Failed to load interview'); navigate('/dashboard'); });
  }, [id, navigate]);

  // Per-question timer
  useEffect(() => {
    if (!interview || submitted.includes(currentQ)) return;
    setTimeLeft(120);
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); handleAutoSubmit(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [currentQ, interview]);

  // Total session timer
  useEffect(() => {
    const t = setInterval(() => setTotalTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Anti-cheat: tab visibility
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setCheatingFlags(f => f + 1);
        interviewAPI.reportCheating(id, 'tabSwitch').catch(() => {});
        toast.error('⚠ Tab switch detected! This is logged.', { duration: 3000 });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [id]);

  // Anti-cheat: copy-paste
  useEffect(() => {
    const onPaste = () => {
      setCheatingFlags(f => f + 1);
      interviewAPI.reportCheating(id, 'copyPaste').catch(() => {});
      toast.error('⚠ Paste detected!', { duration: 2000 });
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [id]);

  const handleAutoSubmit = useCallback(async () => {
    if (submitted.includes(currentQ) || !answer.trim()) {
      setSubmitted(p => [...p, currentQ]);
      return;
    }
    await submitAnswer();
  }, [currentQ, answer, submitted]);

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer before submitting');
    if (submitted.includes(currentQ)) return;
    setSubmitting(true);
    try {
      const q = interview.questions[currentQ];
      const { data } = await interviewAPI.submitAnswer(id, {
        questionId: q._id,
        answerText: answer,
        timeSpent: 120 - timeLeft,
      });
      setLastFeedback(data.analysis);
      setSubmitted(p => [...p, currentQ]);
      setAnswer('');
      toast.success(`Score: ${data.analysis.score}/10`, { icon: '🎯' });
    } catch { toast.error('Failed to submit answer'); }
    finally { setSubmitting(false); }
  };

  const handleEndInterview = async () => {
    if (submitted.length === 0) return toast.error('Answer at least one question first');
    setEnding(true);
    const result = await dispatch(endInterview(id));
    if (!result.error) {
      navigate(`/dashboard/interview/${id}/report`);
    } else {
      toast.error('Failed to end interview');
      setEnding(false);
    }
  };

  const goNext = () => {
    if (currentQ < interview.questions.length - 1) {
      setCurrentQ(c => c + 1);
      setLastFeedback(null);
      setAnswer('');
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Brain size={40} className="text-accent mx-auto mb-4 animate-pulse" />
        <p className="text-text-secondary">Loading interview...</p>
      </div>
    </div>
  );

  const q = interview?.questions[currentQ];
  const progress = ((currentQ + 1) / interview.questions.length) * 100;
  const answeredCount = submitted.length;
  const isAnswered = submitted.includes(currentQ);
  const timePercent = (timeLeft / 120) * 100;
  const timerColor = timeLeft > 60 ? 'text-green' : timeLeft > 30 ? 'text-amber' : 'text-red';
  const timerBg = timeLeft > 60 ? 'bg-green' : timeLeft > 30 ? 'bg-amber' : 'bg-red';

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm">{interview.jobRole}</span>
          <span className="text-xs font-mono text-text-muted">{interview.domain} · {interview.difficulty}</span>
        </div>
        <div className="flex items-center gap-4">
          {cheatingFlags > 0 && (
            <div className="flex items-center gap-1.5 text-amber text-xs font-mono bg-amber/10 border border-amber/20 px-2.5 py-1 rounded-lg">
              <AlertTriangle size={12} />
              {cheatingFlags} flag{cheatingFlags > 1 ? 's' : ''}
            </div>
          )}
          <span className="text-xs font-mono text-text-muted">Session: {formatTime(totalTime)}</span>
          <span className="text-xs font-mono bg-surface-alt border border-border px-2.5 py-1 rounded-lg">
            {answeredCount}/{interview.questions.length} answered
          </span>
          <button onClick={handleEndInterview} disabled={ending}
            className="px-4 py-1.5 bg-red/10 border border-red/20 text-red text-sm font-semibold rounded-lg hover:bg-red/20 transition-colors flex items-center gap-2">
            {ending ? <Loader size={14} className="animate-spin" /> : null}
            End Interview
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <motion.div className="h-full bg-accent" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          {/* Question number + timer */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-muted">Question</span>
              <div className="flex gap-1">
                {interview.questions.map((_, i) => (
                  <button key={i} onClick={() => { setCurrentQ(i); setLastFeedback(null); setAnswer(''); }}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors
                      ${i === currentQ ? 'bg-accent text-white' : submitted.includes(i) ? 'bg-green/10 border border-green/30 text-green' : 'bg-surface-alt border border-border text-text-muted hover:border-accent/30'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            {!isAnswered && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${timerBg}`} animate={{ width: `${timePercent}%` }} />
                </div>
                <span className={`font-mono text-sm font-bold ${timerColor}`}>
                  <Clock size={13} className="inline mr-1" />{formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-surface border border-border rounded-2xl p-6 mb-5 flex-shrink-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <Brain size={15} className="text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-text-muted">Q{currentQ + 1}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border
                      ${q.category === 'technical' ? 'bg-accent/10 border-accent/20 text-accent' : q.category === 'behavioral' ? 'bg-green/10 border-green/20 text-green' : 'bg-amber/10 border-amber/20 text-amber'}`}>
                      {q.category}
                    </span>
                    <span className="text-xs font-mono text-text-muted">{q.difficulty}</span>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-text-primary">{q.questionText}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Answer Area */}
          {isAnswered ? (
            <div className="flex-1 flex flex-col">
              {lastFeedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-green" />
                    <span className="font-semibold text-sm">Answer Submitted</span>
                    <span className="ml-auto font-bold text-lg text-accent">{lastFeedback.score}/10</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{lastFeedback.feedback}</p>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      { label: 'Confidence', val: lastFeedback.aiAnalysis?.confidence },
                      { label: 'Clarity', val: lastFeedback.aiAnalysis?.clarity },
                      { label: 'Accuracy', val: lastFeedback.aiAnalysis?.technicalAccuracy },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-surface-alt rounded-xl p-3 text-center">
                        <div className="font-bold text-accent">{val || 0}%</div>
                        <div className="text-xs text-text-muted">{label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {currentQ < interview.questions.length - 1 && (
                <button onClick={goNext}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors self-start">
                  Next Question <ChevronRight size={16} />
                </button>
              )}
              {currentQ === interview.questions.length - 1 && (
                <button onClick={handleEndInterview} disabled={ending}
                  className="flex items-center gap-2 px-6 py-3 bg-green/10 border border-green/20 text-green font-bold rounded-xl hover:bg-green/20 transition-colors self-start">
                  {ending ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Finish & Get Report
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                className="flex-1 w-full bg-surface border border-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed min-h-40"
                placeholder="Type your answer here... Be specific and detailed. Use examples from your experience." />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-mono text-text-muted">{answer.length} chars</span>
                <button onClick={submitAnswer} disabled={submitting || !answer.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors">
                  {submitting ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                  {submitting ? 'Analyzing...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Webcam */}
        <div className="w-72 border-l border-border bg-surface flex flex-col p-4 flex-shrink-0 hidden lg:flex">
          <div className="relative rounded-xl overflow-hidden bg-bg border border-border mb-3 aspect-video">
            {camOn ? (
              <Webcam ref={webcamRef} mirrored audio={false}
                className="w-full h-full object-cover"
                videoConstraints={{ width: 280, height: 158, facingMode: 'user' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CameraOff size={24} className="text-text-muted" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
              <span className="text-xs font-mono text-white/60">LIVE</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setCamOn(!camOn)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors
                ${camOn ? 'bg-surface-alt border-border text-text-secondary' : 'bg-red/10 border-red/20 text-red'}`}>
              {camOn ? <Camera size={13} /> : <CameraOff size={13} />}
              {camOn ? 'Cam On' : 'Cam Off'}
            </button>
            <button onClick={() => setMicOn(!micOn)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors
                ${micOn ? 'bg-surface-alt border-border text-text-secondary' : 'bg-red/10 border-red/20 text-red'}`}>
              {micOn ? <Mic size={13} /> : <MicOff size={13} />}
              {micOn ? 'Mic On' : 'Mic Off'}
            </button>
          </div>

          {/* Interview tips */}
          <div className="bg-surface-alt border border-border rounded-xl p-4 flex-1">
            <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">Tips</p>
            <ul className="space-y-2.5 text-xs text-text-muted leading-relaxed">
              {[
                'Take 5–10 seconds to think before answering',
                'Use the STAR method for behavioral questions',
                'Give specific examples from your experience',
                'Speak clearly and avoid filler words',
                'It\'s okay to ask for clarification',
              ].map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent flex-shrink-0">›</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
