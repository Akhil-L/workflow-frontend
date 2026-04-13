import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/mock-data";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import WorkerDashboard from "@/pages/dashboard-worker";
import AdminDashboard from "@/pages/dashboard-admin";
import ClientDashboard from "@/pages/dashboard-client";

function Router() {
  const [location, setLocation] = useLocation();
  const { login, logout } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://workflow-backend-mdfx.onrender.com/api/me",
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const user = await response.json();

          login(user.email, user.role || "worker", user.name);

          // ✅ SIMPLE SAFE REDIRECT (NO CRASH)
          if (user.role === "admin") setLocation("/admin");
          else if (user.role === "client") setLocation("/client");
          else setLocation("/dashboard");

        } else {
          logout();
          setLocation("/auth");
        }

      } catch (err) {
        console.error(err);
        setLocation("/auth");
      }
    };

    checkAuth();
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={WorkerDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/client" component={ClientDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
