import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';
import { connectSocket } from './socket/socket';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import Pricing from './pages/public/Pricing';

// User Pages
import Dashboard from './pages/user/Dashboard';
import StartInterview from './pages/user/StartInterview';
import InterviewSession from './pages/user/InterviewSession';
import InterviewReport from './pages/user/InterviewReport';
import PreviousInterviews from './pages/user/PreviousInterviews';
import ResumeUpload from './pages/user/ResumeUpload';
import Analytics from './pages/user/Analytics';
import CodingPractice from './pages/user/CodingPractice';
import Settings from './pages/user/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, user, token } = useSelector(s => s.auth);
  if (!token && !isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
      connectSocket(token);
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#111318', color: '#e8ebf2', border: '1px solid #1e2330' } }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="start-interview" element={<StartInterview />} />
          <Route path="interview/:id" element={<InterviewSession />} />
          <Route path="interview/:id/report" element={<InterviewReport />} />
          <Route path="interviews" element={<PreviousInterviews />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="coding" element={<CodingPractice />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><DashboardLayout isAdmin /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
