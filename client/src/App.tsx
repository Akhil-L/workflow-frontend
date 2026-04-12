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
import TaskDetail from "@/pages/task-detail";
import TrainingPage from "@/pages/training";
import PayoutsPage from "@/pages/payouts-worker";
import ProfilePage from "@/pages/worker-profile";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import ForBusinesses from "@/pages/for-businesses";
import ClientDashboard from "@/pages/dashboard-client";
import { TermsPage, PrivacyPage, PayoutPolicyPage } from "@/pages/legal";

function Router() {
  const [location, setLocation] = useLocation();
  const { currentUser, login, logout, fetchTasks, fetchSubmissions } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://workflow-backend-mdfx.onrender.com/api/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const userData = await response.json();
          // Store actual user data and map it to our UI store structure
          login(userData.email, userData.role || "worker", userData.name);
          
          // Fetch initial data after successful login
          await Promise.all([
            fetchTasks(),
            fetchSubmissions()
          ]);
          
          // Route protection based on role
          const role = userData.role || "worker";
          const path = location;
          
          // Worker trying to access admin/client routes
          if (role === "worker" && (path.startsWith("/admin") || path.startsWith("/client"))) {
            setLocation("/dashboard");
          } 
          // Admin trying to access worker/client routes
          else if (role === "admin" && (path.startsWith("/dashboard") || path.startsWith("/training") || path.startsWith("/payouts") || path.startsWith("/client"))) {
            setLocation("/admin");
          }
          // Client trying to access admin/worker routes
          else if (role === "client" && (path.startsWith("/dashboard") || path.startsWith("/training") || path.startsWith("/payouts") || path.startsWith("/admin"))) {
            setLocation("/client");
          }
          // Redirect to respective dashboards if on root but logged in (optional but good UX)
          else if (path === "/" || path === "/auth") {
            if (role === "admin") setLocation("/admin");
            else if (role === "client") setLocation("/client");
            else setLocation("/dashboard");
          }
        } else {
          logout();
          if (location !== "/" && location !== "/auth" && !location.startsWith("/about") && !location.startsWith("/contact") && !location.startsWith("/businesses") && !location.startsWith("/terms") && !location.startsWith("/privacy") && !location.startsWith("/payout-policy")) {
             setLocation("/auth");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    checkAuth();
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={WorkerDashboard} />
      <Route path="/client" component={ClientDashboard} />
      <Route path="/payouts" component={PayoutsPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/training" component={TrainingPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/task/:id" component={TaskDetail} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/businesses" component={ForBusinesses} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/payout-policy" component={PayoutPolicyPage} />
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
