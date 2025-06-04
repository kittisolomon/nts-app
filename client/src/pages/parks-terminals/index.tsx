import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Park } from "@/lib/types";
import { Filter, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ParksTerminals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const { data: parks, isLoading } = useQuery<Park[]>({
    queryKey: ['/api/parks'],
  });

  const filteredParks = parks ? parks.filter(park => {
    const matchesSearch = 
      park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      park.status === statusFilter;
    
    const matchesRegion = 
      regionFilter === "all" || 
      park.region.toLowerCase().includes(regionFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRegion;
  }) : [];

  // Calculate total stats
  const totalCapacity = parks?.reduce((sum, park) => sum + park.capacity, 0) || 0;
  const totalVehicles = parks?.reduce((sum, park) => sum + park.currentVehicles, 0) || 0;
  const utilizationRate = totalCapacity > 0 ? (totalVehicles / totalCapacity) * 100 : 0;

  // Calculate the percentage for the progress bar
  const calculatePercentage = (current: number, total: number) => {
    return (current / total) * 100;
  };

  return (
    <div>
      <PageHeader
        title="Parks & Terminals"
        description="Manage transport parks and terminals across Nigeria"
        actions={
          <Button>
            <i className="fas fa-plus mr-2"></i>
            Add New Park
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Parks</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-building text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : parks?.length || 0}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Registered in system</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Active Parks</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : 
                parks?.filter(p => p.status === "active").length || 0}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((parks?.filter(p => p.status === "active").length || 0) / (parks?.length || 1) * 100)}% operational`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Current Vehicles</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-bus-alt text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalVehicles}
            </div>
            <div className="mt-1 text-sm text-blue-600">
              {isLoading ? <Skeleton className="h-4 w-36" /> : 
                `Across ${parks?.filter(p => p.currentVehicles > 0).length || 0} parks`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Utilization Rate</div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <i className="fas fa-chart-line text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${Math.round(utilizationRate)}%`}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {isLoading ? <Skeleton className="h-4 w-36" /> : `${totalVehicles} of ${totalCapacity} capacity`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="relative h-[300px]">
          <img 
            src="https://pixabay.com/get/gbf20397341ff24f8eb5f4d9d6a4d6f1e1468e77612e60fb144fe0e5438cc006b7fa4d017c1fd1629e0b2a7f4332a578e95c7c975279ab01fdf9b9bd032772673_1280.jpg" 
            alt="Nigeria parks and terminals map" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <i className="fas fa-map-marked-alt text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Parks & Terminals Locations</h4>
              <p className="text-sm text-gray-300 mb-4">View all registered parks and terminals on an interactive map</p>
              <Button>
                <MapPin className="h-4 w-4 mr-2" /> View Map
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Parks</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search parks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="south west">South West</SelectItem>
                  <SelectItem value="south east">South East</SelectItem>
                  <SelectItem value="south south">South South</SelectItem>
                  <SelectItem value="north central">North Central</SelectItem>
                  <SelectItem value="north west">North West</SelectItem>
                  <SelectItem value="north east">North East</SelectItem>
                  <SelectItem value="fct">FCT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-3 font-medium text-sm">Park Name</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Location</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Vehicles</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Capacity</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24 mb-1" />
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20 mb-1" />
                            <Skeleton className="h-2 w-24 rounded-full" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-9 w-20 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      filteredParks.map((park) => (
                        <tr key={park.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{park.name}</div>
                            <div className="text-sm text-neutral-500">ID: {park.code}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-primary mr-1" />
                              <span>{park.location}</span>
                            </div>
                            <div className="text-sm text-neutral-500">{park.region}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium">{park.currentVehicles} / {park.capacity}</div>
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full",
                                  calculatePercentage(park.currentVehicles, park.capacity) > 70 ? "bg-warning-500" : "bg-primary-500"
                                )} 
                                style={{ width: `${calculatePercentage(park.currentVehicles, park.capacity)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{park.passengerCapacity} passengers/day</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={cn(
                              "text-xs px-2 py-1 rounded-full inline-block",
                              park.status === "active" ? "bg-green-100 text-green-800" : 
                              park.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"
                            )}>
                              {park.status.charAt(0).toUpperCase() + park.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              <i className="fas fa-eye mr-1"></i> View
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-edit mr-1"></i> Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {!isLoading && filteredParks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                          No parks found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredParks.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredParks.length}</span> of <span className="font-medium">{filteredParks.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Filter by Active Parks</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view only active parks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Filter by Parks Under Maintenance</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view parks that are currently under maintenance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="closed" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Filter by Closed Parks</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view parks that are currently closed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
