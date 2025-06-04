import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Vehicle } from "@/lib/types";
import { Filter, MapPin, Search } from "lucide-react";

export default function VehicleTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoute, setFilterRoute] = useState("all");

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['https://nts-app.onrender.com/api/vehicles'],
  });

  const filteredVehicles = vehicles ? vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.currentRoute.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      vehicle.trackingStatus === filterStatus;
    
    // Simple route filtering logic - could be improved with proper route data
    const matchesRoute = 
      filterRoute === "all" || 
      vehicle.currentRoute.toLowerCase().includes(filterRoute.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRoute;
  }) : [];

  return (
    <div>
      <PageHeader
        title="Vehicle Tracking"
        description="Real-time tracking and monitoring of all registered vehicles"
        actions={
          <Button>
            <i className="fas fa-plus mr-2"></i>
            Register New Vehicle
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-green-600 font-semibold text-xl mb-1">
                  {isLoading ? <Skeleton className="h-7 w-8" /> : 
                    vehicles?.filter(v => v.trackingStatus === "on_schedule").length || 0}
                </div>
                <div className="text-sm text-neutral-700">On Schedule</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-blue-600 font-semibold text-xl mb-1">
                  {isLoading ? <Skeleton className="h-7 w-8" /> : 
                    vehicles?.filter(v => v.trackingStatus === "delayed").length || 0}
                </div>
                <div className="text-sm text-neutral-700">Delayed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-yellow-600 font-semibold text-xl mb-1">
                  {isLoading ? <Skeleton className="h-7 w-8" /> : 
                    vehicles?.filter(v => v.trackingStatus === "stopped").length || 0}
                </div>
                <div className="text-sm text-neutral-700">Stopped</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-red-600 font-semibold text-xl mb-1">
                  {isLoading ? <Skeleton className="h-7 w-8" /> : 
                    vehicles?.filter(v => v.trackingStatus === "alert").length || 0}
                </div>
                <div className="text-sm text-neutral-700">Alert</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))
              ) : (
                // Group vehicles by route and get top 3
                Object.entries(
                  (vehicles || []).reduce<Record<string, number>>((acc, vehicle) => {
                    acc[vehicle.currentRoute] = (acc[vehicle.currentRoute] || 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([route, count], index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">{route}</span>
                      </div>
                      <div className="text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                        {count} vehicles
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="relative h-[400px]">
          <img 
            src="https://pixabay.com/get/gbf20397341ff24f8eb5f4d9d6a4d6f1e1468e77612e60fb144fe0e5438cc006b7fa4d017c1fd1629e0b2a7f4332a578e95c7c975279ab01fdf9b9bd032772673_1280.jpg" 
            alt="Live tracking map" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <i className="fas fa-map-marked-alt text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Full Vehicle Tracking Map</h4>
              <p className="text-sm text-gray-300 mb-4">This map shows the real-time position of all vehicles in the system.</p>
              <Button>Open Interactive Map</Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg">Vehicle Tracking List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on_schedule">On Schedule</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={filterRoute} onValueChange={setFilterRoute}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Routes</SelectItem>
                  <SelectItem value="lagos">Lagos Routes</SelectItem>
                  <SelectItem value="abuja">Abuja Routes</SelectItem>
                  <SelectItem value="port harcourt">Port Harcourt Routes</SelectItem>
                  <SelectItem value="kano">Kano Routes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-medium text-sm">Vehicle</th>
                  <th className="text-left px-4 py-2 font-medium text-sm">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-sm">Route</th>
                  <th className="text-left px-4 py-2 font-medium text-sm">Passengers</th>
                  <th className="text-left px-4 py-2 font-medium text-sm">Driver</th>
                  <th className="text-left px-4 py-2 font-medium text-sm">ETA</th>
                  <th className="text-right px-4 py-2 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-7 w-20 rounded-full" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-10" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Skeleton className="h-9 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{vehicle.plateNumber}</div>
                        <div className="text-sm text-neutral-500">{vehicle.model}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center
                          ${vehicle.trackingStatus === 'on_schedule' ? 'bg-green-100 text-green-800' : 
                            vehicle.trackingStatus === 'delayed' ? 'bg-blue-100 text-blue-800' :
                            vehicle.trackingStatus === 'stopped' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`
                        }>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1
                            ${vehicle.trackingStatus === 'on_schedule' ? 'bg-green-500' : 
                              vehicle.trackingStatus === 'delayed' ? 'bg-blue-500' :
                              vehicle.trackingStatus === 'stopped' ? 'bg-yellow-500' :
                              'bg-red-500'}`
                          }></span>
                          {vehicle.trackingStatus === 'on_schedule' ? 'On Schedule' : 
                            vehicle.trackingStatus === 'delayed' ? 'Delayed' :
                            vehicle.trackingStatus === 'stopped' ? 'Stopped' :
                            'Alert'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <i className="fas fa-route mr-1 text-primary"></i>
                          <span>{vehicle.currentRoute}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <i className="fas fa-users mr-1"></i>
                          <span>{vehicle.onboardPassengers}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {/* This would ideally fetch the driver name based on driverId */}
                        <span>Driver {vehicle.driverId || "N/A"}</span>
                      </td>
                      <td className="px-4 py-3">
                        {vehicle.expectedArrival ? 
                          new Date(vehicle.expectedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                          'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm">
                          <i className="fas fa-eye mr-1"></i> Track
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                
                {!isLoading && filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                      No vehicles match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
