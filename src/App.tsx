import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MySessionsProvider } from "@/contexts/MySessionsContext";
import { AppHeader } from "@/components/AppHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import Index from "./pages/Index";
import SessionView from "./pages/SessionView";
import Profile from "./pages/Profile";
import MySessions from "./pages/MySessions";
import Threads from "./pages/Threads";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <Breadcrumbs />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          {FEATURE_FLAGS.EXPLORER_ENABLED ? (
            <>
              <Route path="/" element={<MySessions />} />
              <Route path="/my-sessions" element={<MySessions />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/threads" replace />} />
              <Route path="/my-sessions" element={<Navigate to="/threads" replace />} />
            </>
          )}
          <Route path="/threads" element={<Threads />} />
          {FEATURE_FLAGS.FEED_ENABLED && (
            <Route path="/explore" element={<Index />} />
          )}
          <Route path="/session/:id" element={<SessionView />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MySessionsProvider>
            <AppContent />
          </MySessionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
