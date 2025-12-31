import { Routes, Route } from 'react-router-dom';

// Pages
import Index from '@/pages/Index';
import AdminLogin from '@/pages/AdminLogin';
import StudentLogin from '@/pages/StudentLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCandidates from '@/pages/admin/AdminCandidates';
import AdminVoters from '@/pages/admin/AdminVoters';
import AdminResults from '@/pages/admin/AdminResults';
import AdminSettings from '@/pages/admin/AdminSettings';
import StudentDashboard from '@/pages/student/StudentDashboard';
import CandidateDashboard from '@/pages/candidate/CandidateDashboard';
import NotFound from '@/pages/NotFound';

// Route protection
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/candidates"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCandidates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/voters"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminVoters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Candidate routes */}
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
