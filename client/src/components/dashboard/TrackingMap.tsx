import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Vehicle } from "@/lib/types";

type TrackingMapProps = {
  isLoading: boolean;
  vehicles: Vehicle[];
};

export default function TrackingMap({ isLoading, vehicles }: TrackingMapProps) {
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  
  const vehicleCounts = {
    onSchedule: vehicles.filter(v => v.trackingStatus === "on_schedule").length,
    delayed: vehicles.filter(v => v.trackingStatus === "delayed").length,
    stopped: vehicles.filter(v => v.trackingStatus === "stopped").length,
    alert: vehicles.filter(v => v.trackingStatus === "alert").length,
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold">Vehicle Tracking Map</CardTitle>
        <div className="flex items-center space-x-3">
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Routes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="lagos-abuja">Lagos - Abuja</SelectItem>
                <SelectItem value="lagos-ph">Lagos - Port Harcourt</SelectItem>
                <SelectItem value="abuja-kano">Abuja - Kano</SelectItem>
                <SelectItem value="enugu-asaba">Enugu - Asaba</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="text-primary bg-primary/5 hover:bg-primary/10 border-primary/10">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative h-96">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <>
              <img 
                src="https://pixabay.com/get/gbf20397341ff24f8eb5f4d9d6a4d6f1e1468e77612e60fb144fe0e5438cc006b7fa4d017c1fd1629e0b2a7f4332a578e95c7c975279ab01fdf9b9bd032772673_1280.jpg" 
                alt="Map view of Nigeria with vehicle tracking" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <i className="fas fa-map-marked-alt text-4xl mb-3"></i>
                  <h4 className="text-xl font-semibold mb-2">Interactive Tracking Map</h4>
                  <p className="text-sm text-gray-300 mb-4">Real-time location and status tracking for all registered vehicles.</p>
                  <Button>Load Interactive Map</Button>
                </div>
              </div>
              
              {/* Vehicle Indicators */}
              <div className="absolute top-1/4 left-1/3">
                <div className="map-indicator map-indicator-green"></div>
              </div>
              <div className="absolute top-1/3 right-1/4">
                <div className="map-indicator map-indicator-blue"></div>
              </div>
              <div className="absolute bottom-1/4 left-1/2">
                <div className="map-indicator map-indicator-yellow"></div>
              </div>
              <div className="absolute bottom-1/3 right-1/3">
                <div className="map-indicator map-indicator-red"></div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-neutral-600">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span>On Schedule ({vehicleCounts.onSchedule})</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span>Delayed ({vehicleCounts.delayed})</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span>Stopped ({vehicleCounts.stopped})</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span>Alert ({vehicleCounts.alert})</span>
          </div>
        </div>
        <a href="#" className="text-primary hover:text-primary/90 font-medium mt-2 sm:mt-0">
          Open Full Map <i className="fas fa-external-link-alt ml-1"></i>
        </a>
      </CardFooter>
    </Card>
  );
}
