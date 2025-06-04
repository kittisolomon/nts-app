import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Agency, SecurityAlert } from "@/lib/types";
import { Filter, Search, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityIntegration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: agencies, isLoading: isLoadingAgencies } = useQuery<Agency[]>({
    queryKey: ['/api/agencies'],
  });

  const { data: securityAlerts, isLoading: isLoadingAlerts } = useQuery<SecurityAlert[]>({
    queryKey: ['/api/security-alerts'],
  });

  // Implement filtering for alerts
  const filteredAlerts = securityAlerts ? securityAlerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = 
      priorityFilter === "all" || 
      alert.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  }) : [];

  const handleViewAlert = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    setIsViewDialogOpen(true);
  };

  // Calculate stats
  const connectedAgencies = agencies?.length || 0;
  const totalConnections = agencies?.reduce((sum, agency) => sum + agency.activeConnections, 0) || 0;
  const highPriorityAlerts = securityAlerts?.filter(alert => alert.priority === "high").length || 0;
  const activeAlerts = securityAlerts?.filter(alert => alert.status === "active").length || 0;

  return (
    <div>
      <PageHeader
        title="Security Integration"
        description="Connect and coordinate with security agencies for enhanced transport safety"
        actions={
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Register New Agency
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Connected Agencies</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-shield-alt text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingAgencies ? <Skeleton className="h-8 w-16" /> : connectedAgencies}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Security institutions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Active Connections</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-plug text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingAgencies ? <Skeleton className="h-8 w-16" /> : totalConnections}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoadingAgencies ? <Skeleton className="h-4 w-24" /> : 
                `Across ${connectedAgencies} agencies`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">High Priority Alerts</div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <i className="fas fa-exclamation-triangle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingAlerts ? <Skeleton className="h-8 w-16" /> : highPriorityAlerts}
            </div>
            <div className="mt-1 text-sm text-red-600">
              {isLoadingAlerts ? <Skeleton className="h-4 w-24" /> : 
                `Requires immediate attention`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Active Alerts</div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <i className="fas fa-bell text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingAlerts ? <Skeleton className="h-8 w-16" /> : activeAlerts}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {isLoadingAlerts ? <Skeleton className="h-4 w-36" /> : 
                `${((activeAlerts / (securityAlerts?.length || 1)) * 100).toFixed(0)}% of all alerts`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Security Agencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingAgencies ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="w-2 h-2 rounded-full" />
                  </div>
                ))
              ) : (
                agencies?.map((agency) => (
                  <div key={agency.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                        <i className={agency.type === 'police' ? 'fas fa-shield-alt' : 
                                    agency.type === 'immigration' ? 'fas fa-id-card' :
                                    agency.type === 'road_safety' ? 'fas fa-road' : 'fas fa-box'}></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{agency.name}</div>
                        <div className="text-xs text-neutral-500">{agency.activeConnections} active connections</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        agency.connectionStatus === 'active' ? 'bg-green-500' : 
                        agency.connectionStatus === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      )}></div>
                    </div>
                  </div>
                ))
              )}
              
              {!isLoadingAgencies && (!agencies || agencies.length === 0) && (
                <div className="text-center py-6 text-neutral-500">
                  No security agencies connected
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <i className="fas fa-plus mr-2"></i> Connect New Agency
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg">Security Alerts</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Alerts</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  <TabsTrigger value="false_alarm">False Alarm</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {isLoadingAlerts ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start">
                            <Skeleton className="w-8 h-8 rounded-full mr-3" />
                            <div className="w-full">
                              <Skeleton className="h-4 w-3/4 mb-1" />
                              <Skeleton className="h-3 w-full mb-1" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      filteredAlerts.map((alert) => {
                        const priorityClass = 
                          alert.priority === 'high' 
                            ? 'border-red-200 bg-red-50' 
                            : alert.priority === 'medium'
                              ? 'border-yellow-200 bg-yellow-50'
                              : 'border-blue-200 bg-blue-50';
                        
                        const iconClass =
                          alert.priority === 'high'
                            ? 'bg-red-100 text-red-600'
                            : alert.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-600';
                        
                        const icon =
                          alert.priority === 'high'
                            ? 'fas fa-exclamation-triangle'
                            : alert.priority === 'medium'
                              ? 'fas fa-bell'
                              : 'fas fa-info-circle';
                        
                        const textClass =
                          alert.priority === 'high'
                            ? 'text-red-700'
                            : alert.priority === 'medium'
                              ? 'text-yellow-700'
                              : 'text-blue-700';
                        
                        const descriptionClass =
                          alert.priority === 'high'
                            ? 'text-red-600'
                            : alert.priority === 'medium'
                              ? 'text-yellow-600'
                              : 'text-blue-600';
                        
                        const statusClass =
                          alert.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : alert.status === 'resolved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800';

                        return (
                          <div 
                            key={alert.id} 
                            className={cn("p-3 border rounded-lg cursor-pointer", priorityClass)}
                            onClick={() => handleViewAlert(alert)}
                          >
                            <div className="flex items-start">
                              <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3", iconClass)}>
                                <i className={icon}></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className={cn("text-sm font-medium", textClass)}>
                                    {alert.title}
                                  </div>
                                  <div className={cn("text-xs px-2 py-0.5 rounded-full", statusClass)}>
                                    {alert.status.replace('_', ' ').charAt(0).toUpperCase() + alert.status.replace('_', ' ').slice(1)}
                                  </div>
                                </div>
                                <div className={cn("text-xs", descriptionClass)}>{alert.description}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="text-xs text-neutral-500">
                                    {(() => {
                                      try {
                                        return new Date(alert.timestamp).toRelative();
                                      } catch (e) {
                                        // Fallback if toRelative is not available
                                        return new Date(alert.timestamp).toLocaleDateString();
                                      }
                                    })()}
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {!isLoadingAlerts && filteredAlerts.length === 0 && (
                      <div className="text-center py-6 text-neutral-500">
                        No security alerts matching your criteria
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="active">
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <i className="fas fa-filter text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Active Alerts</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Use the filter options above to view active security alerts.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved">
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <i className="fas fa-filter text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Resolved Alerts</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Use the filter options above to view resolved security alerts.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="false_alarm">
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <i className="fas fa-filter text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">False Alarm Alerts</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Use the filter options above to view false alarm security alerts.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integrated Security Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                  <i className="fas fa-video"></i>
                </div>
                <div>
                  <div className="font-medium">CCTV Integration</div>
                  <div className="text-sm text-green-600">Connected</div>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Surveillance cameras at terminals and major highways are connected for real-time monitoring.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View CCTV Dashboard
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                  <i className="fas fa-database"></i>
                </div>
                <div>
                  <div className="font-medium">Passenger Database</div>
                  <div className="text-sm text-green-600">Connected</div>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Secure database sharing with immigration and police for identity verification.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Access Database
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                  <i className="fas fa-search"></i>
                </div>
                <div>
                  <div className="font-medium">Scanning Systems</div>
                  <div className="text-sm text-yellow-600">Partial Connection</div>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Baggage and cargo scanning integration with customs for contraband detection.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Scanning Status
              </Button>
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                <i className="fas fa-info-circle text-xl"></i>
              </div>
              <div>
                <div className="text-lg font-medium text-blue-800 mb-1">Security Protocol Notice</div>
                <div className="text-sm text-blue-700">
                  Emergency response protocols have been updated. All security agencies are required to complete the new training module by the end of the month. This ensures compliance with the National Security Directive 2023/05.
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="bg-white text-primary border-primary">
                    View Updated Protocols
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security Alert Details</DialogTitle>
            <DialogDescription>
              Detailed information about the security alert
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                selectedAlert.priority === 'high' ? 'bg-red-50 border border-red-200' : 
                selectedAlert.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              )}>
                <div className="flex items-center mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    selectedAlert.priority === 'high' ? 'bg-red-100 text-red-600' : 
                    selectedAlert.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  )}>
                    <i className={
                      selectedAlert.priority === 'high' ? 'fas fa-exclamation-triangle' : 
                      selectedAlert.priority === 'medium' ? 'fas fa-bell' :
                      'fas fa-info-circle'
                    }></i>
                  </div>
                  <div className={cn(
                    "font-medium",
                    selectedAlert.priority === 'high' ? 'text-red-700' : 
                    selectedAlert.priority === 'medium' ? 'text-yellow-700' :
                    'text-blue-700'
                  )}>
                    {selectedAlert.priority.charAt(0).toUpperCase() + selectedAlert.priority.slice(1)} Priority Alert
                  </div>
                </div>
                <div className="text-lg font-bold">{selectedAlert.title}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Status</div>
                  <div className={cn(
                    "text-sm px-2 py-1 rounded-full inline-block mt-1",
                    selectedAlert.status === 'active' ? 'bg-green-100 text-green-800' : 
                    selectedAlert.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {selectedAlert.status.replace('_', ' ').charAt(0).toUpperCase() + selectedAlert.status.replace('_', ' ').slice(1)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Reported At</div>
                  <div className="font-medium">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Location</div>
                  <div className="font-medium">{selectedAlert.location || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Agency</div>
                  <div className="font-medium">
                    {selectedAlert.agencyId ? `Agency ID: ${selectedAlert.agencyId}` : "N/A"}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-neutral-500 mb-1">Description</div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedAlert.description}
                </div>
              </div>
              
              {selectedAlert.vehicleId && (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Related Vehicle</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm flex items-center">
                    <i className="fas fa-bus text-primary mr-2"></i>
                    <span>Vehicle ID: {selectedAlert.vehicleId}</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View Vehicle
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="w-full">
                <i className="fas fa-share-alt mr-2"></i> Share
              </Button>
              <Button variant={selectedAlert?.status === 'active' ? 'default' : 'outline'} className="w-full">
                {selectedAlert?.status === 'active' ? (
                  <>
                    <i className="fas fa-check-circle mr-2"></i> Mark as Resolved
                  </>
                ) : (
                  <>
                    <i className="fas fa-undo mr-2"></i> Reopen Alert
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
