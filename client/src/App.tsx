import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import VehicleTracking from "@/pages/vehicle-tracking";
import ManifestSystem from "@/pages/manifest-system";
import TrafficMonitoring from "@/pages/traffic-monitoring";
import ParksTerminals from "@/pages/parks-terminals";
import PassengerManagement from "@/pages/passenger-management";
import LogisticsParcels from "@/pages/logistics-parcels";
import SecurityIntegration from "@/pages/security-integration";
import Violations from "@/pages/violations";
import ReportsAnalytics from "@/pages/reports-analytics";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/vehicle-tracking" component={VehicleTracking} />
      <Route path="/manifest-system" component={ManifestSystem} />
      <Route path="/traffic-monitoring" component={TrafficMonitoring} />
      <Route path="/parks-terminals" component={ParksTerminals} />
      <Route path="/passenger-management" component={PassengerManagement} />
      <Route path="/logistics-parcels" component={LogisticsParcels} />
      <Route path="/security-integration" component={SecurityIntegration} />
      <Route path="/violations" component={Violations} />
      <Route path="/reports-analytics" component={ReportsAnalytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
