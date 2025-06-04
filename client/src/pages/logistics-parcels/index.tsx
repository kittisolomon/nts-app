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
import { Parcel } from "@/lib/types";
import { Filter, Package, Search, Truck } from "lucide-react";

export default function LogisticsParcels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: parcels, isLoading } = useQuery<Parcel[]>({
    queryKey: ['https://nts-app.onrender.com/api/parcels'],
  });

  // Implement filtering for parcels
  const filteredParcels = parcels ? parcels.filter(parcel => {
    const matchesSearch = 
      parcel.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      parcel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleViewParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setIsViewDialogOpen(true);
  };

  // Default to empty array if data is not loaded
  const inTransitCount = parcels?.filter(p => p.status === "in_transit").length || 0;
  const deliveredCount = parcels?.filter(p => p.status === "delivered").length || 0;
  const returnedCount = parcels?.filter(p => p.status === "returned").length || 0;
  const totalWeight = parcels?.reduce((sum, parcel) => sum + parcel.weight, 0) || 0;

  return (
    <div>
      <PageHeader
        title="Logistics & Parcels"
        description="Manage and track parcels and cargo across the transport network"
        actions={
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Register New Parcel
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Parcels</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-box text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : parcels?.length || 0}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Registered in system</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">In Transit</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-shipping-fast text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : inTransitCount}
            </div>
            <div className="mt-1 text-sm text-blue-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((inTransitCount / (parcels?.length || 1)) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Delivered</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : deliveredCount}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((deliveredCount / (parcels?.length || 1)) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Weight</div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <i className="fas fa-weight text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${totalWeight} kg`}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Across all parcels</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="relative h-[300px]">
          <img 
            src="https://pixabay.com/get/ge3aaac5d34f74204c2bc2ee38ee2147e27be0fb40c50ee99ba82e4b5c551fc5a89b1ffd2e56a7a67c8d7f6daa51e9e9d_1280.jpg" 
            alt="Logistics and parcels tracking" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <i className="fas fa-truck-loading text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Parcel Tracking System</h4>
              <p className="text-sm text-gray-300 mb-4">Track the real-time location and status of all registered parcels</p>
              <Button>
                <Truck className="h-4 w-4 mr-2" /> Track Parcels
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Parcels</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search parcels..."
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
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
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
                      <th className="text-left px-4 py-3 font-medium text-sm">Tracking Code</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Sender</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Recipient</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Weight</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Verification</th>
                      <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3"><Skeleton className="h-5 w-32" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                          <td className="px-4 py-3 text-right"><Skeleton className="h-9 w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : (
                      filteredParcels.map((parcel) => (
                        <tr key={parcel.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-primary">{parcel.trackingCode}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{parcel.senderName}</div>
                            <div className="text-xs text-neutral-500">{parcel.senderContact}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{parcel.recipientName}</div>
                            <div className="text-xs text-neutral-500">{parcel.recipientContact}</div>
                          </td>
                          <td className="px-4 py-3">
                            {parcel.weight} kg
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block
                              ${parcel.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                                parcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-amber-100 text-amber-800'}`
                            }>
                              {parcel.status === 'in_transit' ? 'In Transit' : 
                                parcel.status === 'delivered' ? 'Delivered' : 'Returned'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block
                              ${parcel.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                                parcel.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`
                            }>
                              {parcel.verificationStatus.charAt(0).toUpperCase() + parcel.verificationStatus.slice(1)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewParcel(parcel)}
                            >
                              <i className="fas fa-eye mr-1"></i> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {!isLoading && filteredParcels.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                          No parcels found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredParcels.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredParcels.length}</span> of <span className="font-medium">{filteredParcels.length}</span> results
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
        
        <TabsContent value="in_transit" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">In Transit Parcels</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view parcels that are currently in transit.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Delivered Parcels</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view parcels that have been successfully delivered.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="returned" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Returned Parcels</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Use the filter options above to view parcels that have been returned to sender.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parcel Details</DialogTitle>
            <DialogDescription>
              Detailed information about the parcel
            </DialogDescription>
          </DialogHeader>
          
          {selectedParcel && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-box text-3xl"></i>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mb-4">
                <div className="text-lg font-bold text-primary">{selectedParcel.trackingCode}</div>
                <div className="text-sm text-blue-600">Tracking Code</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Sender</div>
                  <div className="font-medium">{selectedParcel.senderName}</div>
                  <div className="text-sm">{selectedParcel.senderContact}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Recipient</div>
                  <div className="font-medium">{selectedParcel.recipientName}</div>
                  <div className="text-sm">{selectedParcel.recipientContact}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Weight</div>
                  <div className="font-medium">{selectedParcel.weight} kg</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Manifest ID</div>
                  <div className="font-medium text-primary">MNF-{String(20230000 + selectedParcel.manifestId).padStart(8, '0')}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Status</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                    ${selectedParcel.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                      selectedParcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'}`
                  }>
                    {selectedParcel.status === 'in_transit' ? 'In Transit' : 
                      selectedParcel.status === 'delivered' ? 'Delivered' : 'Returned'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Verification</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                    ${selectedParcel.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                      selectedParcel.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`
                  }>
                    {selectedParcel.verificationStatus.charAt(0).toUpperCase() + selectedParcel.verificationStatus.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Description</div>
                <div className="text-sm p-3 bg-gray-50 rounded-lg">
                  {selectedParcel.description}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" className="w-full">
              <i className="fas fa-print mr-2"></i> Print Details
            </Button>
            <Button className="w-full">
              <i className="fas fa-truck mr-2"></i> Track Parcel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
