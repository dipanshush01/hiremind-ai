import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { resumeAPI } from '../../services/api';
import { setUser } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader, X, Brain, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ScoreBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className={`text-xs font-mono font-bold ${color}`}>{value}%</span>
    </div>
    <div className="h-1.5 bg-border rounded-full overflow-hidden">
      <motion.div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: 0.3, duration: 0.8 }} />
    </div>
  </div>
);

export default function ResumeUpload() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const onDrop = useCallback(files => {
    if (files[0]) setFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => toast.error('Invalid file. Use PDF/DOC under 5MB'),
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await resumeAPI.analyze(formData);
      setAnalysis(data.analysis);
      dispatch(setUser({ ...user, skills: data.analysis.technicalSkills, resumeUrl: data.resumeUrl }));
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="font-mono text-xs text-accent uppercase tracking-widest">Resume</span>
        <h1 className="text-3xl font-bold mt-2">Resume Analysis</h1>
        <p className="text-text-secondary mt-1 text-sm">Upload your resume for AI-powered skill extraction and ATS scoring</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <div>
          {user?.resumeUrl && !file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 bg-green/5 border border-green/20 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle size={16} className="text-green flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green">Resume on file</p>
                <p className="text-xs text-text-muted mt-0.5">Upload a new one to update</p>
              </div>
            </motion.div>
          )}

          <div {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 bg-surface'}`}>
            <input {...getInputProps()} />
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border flex items-center justify-center mx-auto mb-4">
              <Upload size={24} className={isDragActive ? 'text-accent' : 'text-text-muted'} />
            </div>
            {isDragActive ? (
              <p className="text-accent font-semibold">Drop your resume here!</p>
            ) : (
              <>
                <p className="font-semibold mb-1">Drag & drop your resume</p>
                <p className="text-sm text-text-muted mb-3">or click to browse files</p>
                <span className="text-xs font-mono text-text-muted bg-surface-alt border border-border px-3 py-1 rounded-full">PDF · DOC · DOCX · max 5MB</span>
              </>
            )}
          </div>

          <AnimatePresence>
            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{file.name}</p>
                  <p className="text-xs text-text-muted font-mono">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={() => setFile(null)} className="p-1.5 hover:bg-surface-alt rounded-lg text-text-muted">
                  <X size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {file && (
            <button onClick={handleUpload} disabled={uploading}
              className="w-full mt-4 py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              {uploading ? <><Loader size={16} className="animate-spin" />Analyzing with AI...</> : <><Brain size={16} />Analyze Resume</>}
            </button>
          )}
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              {/* ATS Score */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2"><Star size={16} className="text-amber" />ATS Score</h3>
                  <div className={`text-2xl font-bold ${analysis.atsScore >= 70 ? 'text-green' : analysis.atsScore >= 50 ? 'text-amber' : 'text-red'}`}>
                    {analysis.atsScore}/100
                  </div>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden mb-4">
                  <motion.div className={`h-full rounded-full ${analysis.atsScore >= 70 ? 'bg-green' : analysis.atsScore >= 50 ? 'bg-amber' : 'bg-red'}`}
                    initial={{ width: 0 }} animate={{ width: `${analysis.atsScore}%` }} transition={{ duration: 1 }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-text-muted">
                  <div>Experience: <span className="text-text-primary font-bold">{analysis.experience}</span></div>
                  <div>Level: <span className="text-text-primary font-bold capitalize">{analysis.seniorityLevel}</span></div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green" />Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.technicalSkills || []).map((s, i) => (
                    <span key={i} className="text-xs font-mono bg-surface-alt border border-border px-2.5 py-1 rounded-lg text-text-secondary hover:border-accent/30 transition-colors">{s}</span>
                  ))}
                </div>
              </div>

              {/* Weak Areas */}
              {analysis.weakAreas?.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-amber" />Weak Areas</h3>
                  <ul className="space-y-2">
                    {analysis.weakAreas.map((w, i) => (
                      <li key={i} className="text-sm text-text-secondary flex gap-2">
                        <span className="text-amber">›</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Top Domains */}
              {analysis.topDomains?.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-accent" />Top Domains</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topDomains.map((d, i) => (
                      <span key={i} className="text-xs font-mono bg-accent/10 border border-accent/20 text-accent px-2.5 py-1 rounded-lg">{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
              <Brain size={36} className="text-text-muted opacity-30 mb-3" />
              <p className="text-text-secondary text-sm">Upload your resume to get AI analysis, ATS score, and skill extraction</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
