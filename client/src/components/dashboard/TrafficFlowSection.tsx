import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { TrafficReport } from "@/lib/types";

type TrafficFlowSectionProps = {
  isLoading: boolean;
  trafficReports: TrafficReport[];
};

export default function TrafficFlowSection({ isLoading, trafficReports }: TrafficFlowSectionProps) {
  // Sort traffic reports by vehicle count (descending)
  const sortedReports = [...trafficReports].sort((a, b) => b.vehicleCount - a.vehicleCount);
  
  return (
    <Card>
      <CardHeader className="flex items-center justify-between border-b border-gray-100">
        <CardTitle className="text-lg font-bold">Traffic Flow Analysis</CardTitle>
        <div className="flex items-center space-x-2">
          <button className="text-neutral-500 hover:text-neutral-700 p-1">
            <RefreshCw className="h-4 w-4" />
          </button>
          <Select defaultValue="24h">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6 rounded-lg border border-gray-200 overflow-hidden">
          <img 
            src="https://pixabay.com/get/gff880315c3e459063d2b89b496d09ab5747e964ceefd93590fd2f5cb84e8a421a7f9448d3ee6e783a347932da34633c791735469ed320d86fcff6280b8c85128_1280.jpg"
            alt="Traffic flow visualization" 
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">High Traffic Routes</h4>
            <ul className="space-y-2 text-sm">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </li>
                ))
              ) : (
                sortedReports.slice(0, 3).map((report) => (
                  <li key={report.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${report.congestionLevel === 'high' ? 'bg-red-500' : report.congestionLevel === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'} rounded-full mr-2`}></div>
                      <span>{report.route}</span>
                    </div>
                    <span className="font-medium">{report.vehicleCount} vehicles</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Peak Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span>6:00 AM - 9:00 AM</span>
                </div>
                <span className="font-medium">High</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span>12:00 PM - 2:00 PM</span>
                </div>
                <span className="font-medium">Medium</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span>4:00 PM - 7:00 PM</span>
                </div>
                <span className="font-medium">High</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-neutral-900 mb-2">Traffic Predictions</h4>
          <div className="text-sm text-neutral-600">
            <p className="mb-2">Based on historical data and current trends, here are the traffic predictions for tomorrow:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Expected 15% increase in Lagos-Abuja route due to upcoming holiday</li>
              <li>Potential congestion in Kano-Kaduna corridor between 2PM-5PM</li>
              <li>Weather alerts may affect Eastern routes (Port Harcourt, Owerri)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
