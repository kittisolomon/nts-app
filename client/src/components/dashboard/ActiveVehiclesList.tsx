import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Vehicle } from "@/lib/types";
import { cn } from "@/lib/utils";

type VehicleStatusBadgeProps = {
  status: string;
};

const VehicleStatusBadge = ({ status }: VehicleStatusBadgeProps) => {
  const statusStyles = {
    "active": "bg-green-100 text-green-800",
    "on_schedule": "bg-green-100 text-green-800",
    "delayed": "bg-orange-100 text-orange-800",
    "stopped": "bg-yellow-100 text-yellow-800",
    "alert": "bg-red-100 text-red-800",
    "maintenance": "bg-blue-100 text-blue-800",
    "inactive": "bg-gray-100 text-gray-800",
  };

  const statusText = {
    "on_schedule": "Active",
    "delayed": "Delayed",
    "stopped": "Stopped",
    "alert": "Alert",
    "maintenance": "Maintenance",
    "inactive": "Inactive",
    "active": "Active",
  };

  const status_key = status as keyof typeof statusStyles;
  
  return (
    <div className={cn("text-xs px-2 py-0.5 rounded-full", statusStyles[status_key])}>
      {statusText[status_key]}
    </div>
  );
};

type ActiveVehiclesListProps = {
  isLoading: boolean;
  vehicles: Vehicle[];
};

export default function ActiveVehiclesList({ isLoading, vehicles }: ActiveVehiclesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.currentRoute.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-bold">Active Vehicles</CardTitle>
        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">LIVE</div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="overflow-y-auto max-h-[350px] pr-1">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-3 border border-gray-100 rounded-lg mb-3">
                <Skeleton className="h-5 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <div className="flex justify-between mt-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))
          ) : (
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-3 border border-gray-100 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{vehicle.plateNumber}</div>
                    <div className="text-xs text-neutral-500">{vehicle.model}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <VehicleStatusBadge status={vehicle.trackingStatus} />
                  </div>
                </div>
                <div className="mt-2 text-xs text-neutral-600 flex items-center">
                  <i className="fas fa-route mr-1"></i>
                  <span>{vehicle.currentRoute}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    <i className="fas fa-users mr-1"></i>
                    <span>{vehicle.onboardPassengers} passengers</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    ETA: {vehicle.expectedArrival ? new Date(vehicle.expectedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gray-100 flex justify-center">
        <Button variant="link" className="text-primary hover:text-primary/90 text-sm font-medium">
          View All Vehicles <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
