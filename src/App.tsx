import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import SubmitBug from "./pages/SubmitBug";
import BugDetail from "./pages/BugDetail";
import DebuggerAvailable from "./pages/DebuggerAvailable";
import DebuggerMyBugs from "./pages/DebuggerMyBugs";
import DebuggerProfile from "./pages/DebuggerProfile";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function DashboardRedirect() {
  const { role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (role === 'debugger') return <Navigate to="/debugger/available" replace />;
  return <ClientDashboard />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <><Navbar /><Landing /></>} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
        <Route path="/bugs/new" element={<ProtectedRoute allowedRoles={['client']}><SubmitBug /></ProtectedRoute>} />
        <Route path="/bugs/:id" element={<ProtectedRoute><BugDetail /></ProtectedRoute>} />
        <Route path="/debugger/available" element={<ProtectedRoute allowedRoles={['debugger']}><DebuggerAvailable /></ProtectedRoute>} />
        <Route path="/debugger/my-bugs" element={<ProtectedRoute allowedRoles={['debugger']}><DebuggerMyBugs /></ProtectedRoute>} />
        <Route path="/debugger/profile" element={<ProtectedRoute allowedRoles={['debugger']}><DebuggerProfile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
