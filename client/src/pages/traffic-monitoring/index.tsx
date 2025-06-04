import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { TrafficReport } from "@/lib/types";

export default function TrafficMonitoring() {
  const [timeRange, setTimeRange] = useState("24h");
  
  const { data: trafficReports, isLoading } = useQuery<TrafficReport[]>({
    queryKey: ['/api/traffic-reports'],
  });

  // Sort traffic reports by congestion level and vehicle count
  const sortedReports = trafficReports 
    ? [...trafficReports].sort((a, b) => {
        // First sort by congestion level
        const levelOrder = { high: 3, medium: 2, low: 1 };
        const levelDiff = levelOrder[b.congestionLevel as keyof typeof levelOrder] - 
                         levelOrder[a.congestionLevel as keyof typeof levelOrder];
        
        // If levels are the same, sort by vehicle count
        if (levelDiff === 0) {
          return b.vehicleCount - a.vehicleCount;
        }
        
        return levelDiff;
      })
    : [];

  const peakHoursList = [
    { time: "6:00 AM - 9:00 AM", level: "high" },
    { time: "12:00 PM - 2:00 PM", level: "medium" },
    { time: "4:00 PM - 7:00 PM", level: "high" }
  ];

  return (
    <div>
      <PageHeader
        title="Traffic Monitoring"
        description="Real-time traffic flow analysis and predictions"
        actions={
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Congestion Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">High Congestion</span>
                </div>
                <div className="text-sm font-medium">
                  {isLoading ? (
                    <Skeleton className="h-5 w-8" />
                  ) : (
                    `${trafficReports?.filter(r => r.congestionLevel === "high").length || 0} routes`
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm">Medium Congestion</span>
                </div>
                <div className="text-sm font-medium">
                  {isLoading ? (
                    <Skeleton className="h-5 w-8" />
                  ) : (
                    `${trafficReports?.filter(r => r.congestionLevel === "medium").length || 0} routes`
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Low Congestion</span>
                </div>
                <div className="text-sm font-medium">
                  {isLoading ? (
                    <Skeleton className="h-5 w-8" />
                  ) : (
                    `${trafficReports?.filter(r => r.congestionLevel === "low").length || 0} routes`
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm font-medium mb-2">Monitored Routes</div>
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : trafficReports?.length || 0}
                </div>
                <div className="text-sm text-neutral-500">Total active monitoring</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="flex items-center justify-between space-y-0">
            <CardTitle className="text-lg">Traffic Map Overview</CardTitle>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[250px]">
              <img 
                src="https://pixabay.com/get/gff880315c3e459063d2b89b496d09ab5747e964ceefd93590fd2f5cb84e8a421a7f9448d3ee6e783a347932da34633c791735469ed320d86fcff6280b8c85128_1280.jpg" 
                alt="Traffic flow visualization" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Button>
                  <i className="fas fa-expand-alt mr-2"></i> View Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">High Traffic Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 rounded-full mr-2" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))
              ) : (
                sortedReports.slice(0, 5).map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        report.congestionLevel === 'high' ? 'bg-red-500' : 
                        report.congestionLevel === 'medium' ? 'bg-orange-500' : 
                        'bg-green-500'
                      }`}></div>
                      <span className="font-medium">{report.route}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      report.congestionLevel === 'high' ? 'bg-red-100 text-red-800' : 
                      report.congestionLevel === 'medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.vehicleCount} vehicles
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Traffic Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHoursList.map((peak, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      peak.level === 'high' ? 'bg-red-500' : 
                      peak.level === 'medium' ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}></div>
                    <span className="font-medium">{peak.time}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    peak.level === 'high' ? 'bg-red-100 text-red-800' : 
                    peak.level === 'medium' ? 'bg-orange-100 text-orange-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {peak.level.charAt(0).toUpperCase() + peak.level.slice(1)}
                  </div>
                </div>
              ))}
              
              <div className="p-3 border border-gray-200 rounded-lg bg-blue-50 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-800">Traffic Advisory</div>
                    <div className="text-xs text-blue-800 mt-1">
                      Expect significant delays on the Lagos-Ibadan expressway due to ongoing 
                      road maintenance. Consider alternate routes during peak hours.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Traffic Predictions & Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-800 mb-3">Expected Tomorrow</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-arrow-up text-red-500 mt-1 mr-2"></i>
                  <span>Expected 15% increase in Lagos-Abuja route due to upcoming holiday</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-exclamation-triangle text-orange-500 mt-1 mr-2"></i>
                  <span>Potential congestion in Kano-Kaduna corridor between 2PM-5PM</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-cloud-rain text-blue-500 mt-1 mr-2"></i>
                  <span>Weather alerts may affect Eastern routes (Port Harcourt, Owerri)</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-800 mb-3">Weekly Forecast</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Monday</span>
                  <span className="text-orange-500 font-medium">Medium</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Tuesday</span>
                  <span className="text-green-500 font-medium">Low</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Wednesday</span>
                  <span className="text-green-500 font-medium">Low</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Thursday</span>
                  <span className="text-orange-500 font-medium">Medium</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Friday</span>
                  <span className="text-red-500 font-medium">High</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Weekend</span>
                  <span className="text-orange-500 font-medium">Medium</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-800 mb-3">Recommended Actions</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Alert drivers about potential congestion on Lagos-Ibadan route</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Consider rescheduling non-essential trips from 4PM-7PM on Friday</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Monitor eastern routes for weather impacts through the weekend</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Deploy additional personnel at highway interchanges during peak hours</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
