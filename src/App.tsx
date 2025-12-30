import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCandidates from "./pages/admin/AdminCandidates";
import AdminVoters from "./pages/admin/AdminVoters";
import AdminResults from "./pages/admin/AdminResults";
import AdminSettings from "./pages/admin/AdminSettings";
import StudentDashboard from "./pages/student/StudentDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/candidates" element={<AdminCandidates />} />
            <Route path="/admin/voters" element={<AdminVoters />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
