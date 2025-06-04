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
import { Violation } from "@/lib/types";
import { Calendar, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Violations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: violations, isLoading } = useQuery<Violation[]>({
    queryKey: ['/api/violations'],
  });

  // Implement filtering for violations
  const filteredViolations = violations ? violations.filter(violation => {
    const matchesSearch = 
      violation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (violation.location && violation.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      typeFilter === "all" || 
      violation.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === "all" || 
      violation.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  }) : [];

  const handleViewViolation = (violation: Violation) => {
    setSelectedViolation(violation);
    setIsViewDialogOpen(true);
  };

  // Calculate stats
  const reportedCount = violations?.filter(v => v.status === "reported").length || 0;
  const underReviewCount = violations?.filter(v => v.status === "under_review").length || 0;
  const resolvedCount = violations?.filter(v => v.status === "resolved").length || 0;
  const totalViolations = violations?.length || 0;

  // Group violations by type
  const violationsByType = violations ? violations.reduce<Record<string, number>>((acc, violation) => {
    acc[violation.type] = (acc[violation.type] || 0) + 1;
    return acc;
  }, {}) : {};
  
  // Sort violation types by count in descending order
  const sortedViolationTypes = Object.entries(violationsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Violations & Offenses"
        description="Monitor and manage transport violations across the network"
        actions={
          <Button>
            <i className="fas fa-plus mr-2"></i>
            Report New Violation
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Violations</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-exclamation-triangle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalViolations}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Recorded in system</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Reported</div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <i className="fas fa-flag text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : reportedCount}
            </div>
            <div className="mt-1 text-sm text-red-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((reportedCount / (totalViolations || 1)) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Under Review</div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                <i className="fas fa-search text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : underReviewCount}
            </div>
            <div className="mt-1 text-sm text-yellow-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((underReviewCount / (totalViolations || 1)) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Resolved</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : resolvedCount}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((resolvedCount / (totalViolations || 1)) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Violation Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : sortedViolationTypes.length > 0 ? (
                sortedViolationTypes.map(([type, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {count} violations
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  No violation data available
                </div>
              )}
              
              {!isLoading && sortedViolationTypes.length > 0 && (
                <div className="pt-4 mt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View Detailed Breakdown
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="w-8 h-8 rounded-full mr-3" />
                    <div className="w-full">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : violations && violations.length > 0 ? (
                violations
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 4)
                  .map((violation) => (
                    <div key={violation.id} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        violation.status === 'reported' ? 'bg-red-100 text-red-600' : 
                        violation.status === 'under_review' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        <i className={
                          violation.status === 'reported' ? 'fas fa-flag' : 
                          violation.status === 'under_review' ? 'fas fa-search' : 
                          'fas fa-check-circle'
                        }></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {violation.status === 'reported' ? 'New violation reported' : 
                           violation.status === 'under_review' ? 'Violation under review' : 
                           'Violation resolved'}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {(() => {
                            try {
                              return new Date(violation.timestamp).toRelative();
                            } catch (e) {
                              // Fallback if toRelative is not available
                              return new Date(violation.timestamp).toLocaleDateString();
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  No recent activity
                </div>
              )}
              
              {!isLoading && violations && violations.length > 0 && (
                <div className="pt-4 mt-2 border-t">
                  <Button variant="link" className="w-full text-primary">
                    View All Activity
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Violation Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">June 2023</h3>
              <p className="text-sm text-neutral-500">Violation Distribution</p>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              <div className="text-xs text-neutral-500">S</div>
              <div className="text-xs text-neutral-500">M</div>
              <div className="text-xs text-neutral-500">T</div>
              <div className="text-xs text-neutral-500">W</div>
              <div className="text-xs text-neutral-500">T</div>
              <div className="text-xs text-neutral-500">F</div>
              <div className="text-xs text-neutral-500">S</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                // Random violation count for illustration
                const count = Math.floor(Math.random() * 5);
                const bgColor = count === 0 ? 'bg-gray-100' : 
                               count === 1 ? 'bg-green-100' :
                               count === 2 ? 'bg-green-200' :
                               count === 3 ? 'bg-yellow-100' :
                               'bg-red-100';
                               
                const textColor = count === 0 ? 'text-gray-400' : 
                                count <= 2 ? 'text-green-800' :
                                count === 3 ? 'text-yellow-800' :
                                'text-red-800';
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "h-8 flex items-center justify-center text-xs rounded-md", 
                      bgColor, textColor
                    )}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t grid grid-cols-4 gap-2">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-100 rounded-sm mr-1"></div>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-green-100 rounded-sm mr-1"></div>
                <span className="text-xs">1</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-100 rounded-sm mr-1"></div>
                <span className="text-xs">3</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-red-100 rounded-sm mr-1"></div>
                <span className="text-xs">4+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Violations</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Violation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="speeding">Speeding</SelectItem>
                  <SelectItem value="overloading">Overloading</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
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
                      <th className="text-left px-4 py-3 font-medium text-sm">Violation ID</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Vehicle</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Description</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-48" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                          <td className="px-4 py-3 text-right"><Skeleton className="h-9 w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : (
                      filteredViolations.map((violation) => (
                        <tr key={violation.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">VIO-{String(violation.id).padStart(5, '0')}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <i className="fas fa-bus text-primary mr-2"></i>
                              <span>Vehicle {violation.vehicleId}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {violation.type.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="line-clamp-1 max-w-xs">
                              {violation.description}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(violation.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block
                              ${violation.status === 'reported' ? 'bg-red-100 text-red-800' : 
                                violation.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'}`
                            }>
                              {violation.status.replace('_', ' ').charAt(0).toUpperCase() + violation.status.replace('_', ' ').slice(1)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewViolation(violation)}
                            >
                              <i className="fas fa-eye mr-1"></i> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {!isLoading && filteredViolations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                          No violations found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredViolations.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredViolations.length}</span> of <span className="font-medium">{filteredViolations.length}</span> results
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
        
        <TabsContent value="reported" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Reported Violations</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view violations that have been reported but not yet reviewed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="under_review" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Under Review Violations</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view violations currently under review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Resolved Violations</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view violations that have been resolved.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Violation Details</DialogTitle>
            <DialogDescription>
              Detailed information about the violation
            </DialogDescription>
          </DialogHeader>
          
          {selectedViolation && (
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                selectedViolation.status === 'reported' ? 'bg-red-50 border border-red-200' : 
                selectedViolation.status === 'under_review' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              )}>
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    selectedViolation.status === 'reported' ? 'bg-red-100 text-red-600' : 
                    selectedViolation.status === 'under_review' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  )}>
                    <i className={
                      selectedViolation.status === 'reported' ? 'fas fa-flag' : 
                      selectedViolation.status === 'under_review' ? 'fas fa-search' :
                      'fas fa-check-circle'
                    }></i>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Violation ID</div>
                    <div className="font-bold">VIO-{String(selectedViolation.id).padStart(5, '0')}</div>
                  </div>
                  <div className={cn(
                    "ml-auto text-xs px-2 py-1 rounded-full",
                    selectedViolation.status === 'reported' ? 'bg-red-100 text-red-800' : 
                    selectedViolation.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {selectedViolation.status.replace('_', ' ').charAt(0).toUpperCase() + selectedViolation.status.replace('_', ' ').slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Vehicle ID</div>
                  <div className="font-medium">
                    <i className="fas fa-bus text-primary mr-1"></i> {selectedViolation.vehicleId}
                  </div>
                </div>
                {selectedViolation.driverId && (
                  <div>
                    <div className="text-sm text-neutral-500">Driver ID</div>
                    <div className="font-medium">
                      <i className="fas fa-user text-primary mr-1"></i> {selectedViolation.driverId}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-neutral-500">Type</div>
                  <div className="font-medium capitalize">{selectedViolation.type.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Reported By</div>
                  <div className="font-medium">User ID: {selectedViolation.reportedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Date & Time</div>
                  <div className="font-medium">{new Date(selectedViolation.timestamp).toLocaleString()}</div>
                </div>
                {selectedViolation.location && (
                  <div>
                    <div className="text-sm text-neutral-500">Location</div>
                    <div className="font-medium">{selectedViolation.location}</div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-neutral-500 mb-1">Description</div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedViolation.description}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="space-x-2">
            {selectedViolation?.status === 'reported' && (
              <Button variant="outline" className="w-full">
                <i className="fas fa-search mr-2"></i> Start Review
              </Button>
            )}
            
            {selectedViolation?.status === 'under_review' && (
              <Button variant="outline" className="w-full">
                <i className="fas fa-check-circle mr-2"></i> Mark as Resolved
              </Button>
            )}
            
            <Button className="w-full">
              <i className="fas fa-file-alt mr-2"></i> Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
