import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleBasedLogin from "./components/auth/RoleBasedLogin";
import Welcome from "./pages/Welcome";
import MenteeDashboard from "./pages/MenteeDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<RoleBasedLogin />} />
            <Route path="/signup" element={<RoleBasedLogin />} />
            <Route 
              path="/welcome" 
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentee-dashboard" 
              element={
                <ProtectedRoute dashboardType="mentee">
                  <MenteeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentor-dashboard" 
              element={
                <ProtectedRoute dashboardType="mentor">
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute dashboardType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
