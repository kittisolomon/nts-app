import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import StatisticCard from "@/components/dashboard/StatisticCard";
import TrackingMap from "@/components/dashboard/TrackingMap";
import ActiveVehiclesList from "@/components/dashboard/ActiveVehiclesList";
import ManifestSection from "@/components/dashboard/ManifestSection";
import TrafficFlowSection from "@/components/dashboard/TrafficFlowSection";
import SecuritySection from "@/components/dashboard/SecuritySection";
import ParksTable from "@/components/dashboard/ParksTable";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['/api/vehicles/active'],
  });
  
  const { data: parks, isLoading: isLoadingParks } = useQuery({
    queryKey: ['/api/parks'],
  });
  
  const { data: manifests, isLoading: isLoadingManifests } = useQuery({
    queryKey: ['/api/manifests/recent'],
  });
  
  const { data: trafficReports, isLoading: isLoadingTrafficReports } = useQuery({
    queryKey: ['/api/traffic-reports'],
  });
  
  const { data: securityAlerts, isLoading: isLoadingSecurityAlerts } = useQuery({
    queryKey: ['/api/security-alerts/recent'],
  });
  
  const { data: agencies, isLoading: isLoadingAgencies } = useQuery({
    queryKey: ['/api/agencies'],
  });

  return (
    <div>
      <PageHeader
        title="Transport Dashboard Overview"
        actions={
          <>
            <select className="appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 days</option>
              <option>This month</option>
              <option>Last month</option>
              <option>Custom range</option>
            </select>
            <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm">
              <i className="fas fa-download"></i>
              <span>Export</span>
            </button>
          </>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatisticCard
          title="Active Vehicles"
          value={isLoadingStats ? "Loading..." : stats?.activeVehicles.toString() || "0"}
          icon="fas fa-bus"
          iconColor="primary"
          trend="12%"
          trendDirection="up"
          trendText="from last week"
        />
        
        <StatisticCard
          title="Passengers Today"
          value={isLoadingStats ? "Loading..." : stats?.passengersToday.toString() || "0"}
          icon="fas fa-users"
          iconColor="secondary"
          trend="8.3%"
          trendDirection="up"
          trendText="from yesterday"
        />
        
        <StatisticCard
          title="Registered Parks"
          value={isLoadingStats ? "Loading..." : stats?.registeredParks.toString() || "0"}
          icon="fas fa-map-marker-alt"
          iconColor="warning"
          trend="4.1%"
          trendDirection="up"
          trendText="from last month"
        />
        
        <StatisticCard
          title="Violations Today"
          value={isLoadingStats ? "Loading..." : stats?.violationsToday.toString() || "0"}
          icon="fas fa-exclamation-triangle"
          iconColor="destructive"
          trend="6.2%"
          trendDirection="up"
          trendText="from last week"
          trendType="negative"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TrackingMap isLoading={isLoadingVehicles} vehicles={vehicles || []} />
        </div>
        
        <div>
          <ActiveVehiclesList isLoading={isLoadingVehicles} vehicles={vehicles || []} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ManifestSection isLoading={isLoadingManifests} manifests={manifests || []} />
        <TrafficFlowSection isLoading={isLoadingTrafficReports} trafficReports={trafficReports || []} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <SecuritySection 
            isLoadingAgencies={isLoadingAgencies} 
            isLoadingAlerts={isLoadingSecurityAlerts} 
            agencies={agencies || []} 
            alerts={securityAlerts || []} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <ParksTable isLoading={isLoadingParks} parks={parks || []} />
        </div>
      </div>
    </div>
  );
}
