import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Manifest } from "@/lib/types";
import QRCodeGenerator from "@/components/manifest/QRCodeGenerator";
import { Download, Filter, Printer, Search, Share2 } from "lucide-react";

export default function ManifestSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const { data: manifests, isLoading } = useQuery<Manifest[]>({
    queryKey: ['/api/manifests'],
  });

  const filteredManifests = manifests ? manifests.filter(manifest => {
    const matchesSearch = 
      manifest.manifestCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      manifest.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleViewQRCode = (manifest: Manifest) => {
    setSelectedManifest(manifest);
    setIsQRDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="E-Manifest System"
        description="Generate, manage, and track digital manifests for all vehicles"
        actions={
          <Button>
            <i className="fas fa-plus mr-2"></i>
            Generate New Manifest
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Manifests</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-file-alt text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : manifests?.length || 0}
            </div>
            <div className="mt-1 text-sm text-neutral-500">All time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Active Manifests</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : 
                manifests?.filter(m => m.status === "active").length || 0}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((manifests?.filter(m => m.status === "active").length || 0) / (manifests?.length || 1) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Passengers Today</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-users text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : 
                manifests?.reduce((sum, manifest) => sum + manifest.passengerCount, 0) || 0}
            </div>
            <div className="mt-1 text-sm text-neutral-500">From all manifests</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Completed Trips</div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <i className="fas fa-flag-checkered text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : 
                manifests?.filter(m => m.status === "completed").length || 0}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Successfully completed</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Manifests</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search manifests..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      <th className="text-left px-4 py-3 font-medium text-sm">Manifest Code</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Vehicle</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Route</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Passengers</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Date</th>
                      <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3"><Skeleton className="h-5 w-32" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-32" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-10" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="px-4 py-3 text-right"><Skeleton className="h-9 w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : (
                      filteredManifests.map((manifest) => (
                        <tr key={manifest.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{manifest.manifestCode}</td>
                          <td className="px-4 py-3">Vehicle {manifest.vehicleId}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <i className="fas fa-map-marker-alt text-red-500 mr-1"></i>
                              <span>Origin to Destination</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <i className="fas fa-users mr-1"></i>
                              <span>{manifest.passengerCount}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block
                              ${manifest.status === 'active' ? 'bg-green-100 text-green-800' : 
                                manifest.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'}`
                            }>
                              {manifest.status.charAt(0).toUpperCase() + manifest.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(manifest.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => handleViewQRCode(manifest)}
                            >
                              <i className="fas fa-qrcode mr-1"></i> QR
                            </Button>
                            <Button size="sm">
                              <i className="fas fa-eye mr-1"></i> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {!isLoading && filteredManifests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                          No manifests found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                <h3 className="text-lg font-medium mb-2">Filter by Active Manifests</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This tab will show only active manifests. Please use the filter options above to narrow down your search.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Filter by Completed Manifests</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This tab will show only completed manifests. Please use the filter options above to narrow down your search.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Filter by Cancelled Manifests</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This tab will show only cancelled manifests. Please use the filter options above to narrow down your search.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-Manifest QR Code</DialogTitle>
            <DialogDescription>
              This QR code contains the manifest information for verification purposes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {selectedManifest && (
              <>
                <QRCodeGenerator value={selectedManifest.manifestCode} size={240} />
                <div className="mt-4 text-center">
                  <div className="text-lg font-medium">{selectedManifest.manifestCode}</div>
                  <div className="text-sm text-neutral-500 mt-1">
                    {/* This would ideally show origin/destination park names */}
                    Origin to Destination • {selectedManifest.passengerCount} passengers
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Created on:</span> {new Date(selectedManifest.createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <div className="flex space-x-2 w-full justify-center">
              <Button variant="outline" size="sm" className="w-full">
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
