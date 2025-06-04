import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search, UserPlus } from "lucide-react";

// Dummy passenger data for UI display purposes
const dummyPassengers = [
  { id: 1, fullName: "John Doe", gender: "Male", age: 34, manifestId: 1, contactPhone: "08012345678", emergencyContact: "08023456789" },
  { id: 2, fullName: "Jane Smith", gender: "Female", age: 28, manifestId: 1, contactPhone: "08023456789", emergencyContact: "08034567890" },
  { id: 3, fullName: "Samuel Johnson", gender: "Male", age: 45, manifestId: 2, contactPhone: "08034567890", emergencyContact: "08045678901" },
  { id: 4, fullName: "Amina Ibrahim", gender: "Female", age: 32, manifestId: 2, contactPhone: "08045678901", emergencyContact: "08056789012" },
  { id: 5, fullName: "Michael Okafor", gender: "Male", age: 29, manifestId: 3, contactPhone: "08056789012", emergencyContact: "08067890123" },
  { id: 6, fullName: "Blessing Nwachukwu", gender: "Female", age: 24, manifestId: 3, contactPhone: "08067890123", emergencyContact: "08078901234" },
  { id: 7, fullName: "Ibrahim Mohammed", gender: "Male", age: 38, manifestId: 4, contactPhone: "08078901234", emergencyContact: "08089012345" },
  { id: 8, fullName: "Fatima Ahmed", gender: "Female", age: 27, manifestId: 4, contactPhone: "08089012345", emergencyContact: "08090123456" },
];

export default function PassengerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPassengers = dummyPassengers.filter(passenger => {
    const matchesSearch = passenger.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passenger.contactPhone.includes(searchTerm);
    
    const matchesGender = genderFilter === "all" || passenger.gender.toLowerCase() === genderFilter.toLowerCase();
    
    return matchesSearch && matchesGender;
  });

  const handleViewPassenger = (passenger: any) => {
    setSelectedPassenger(passenger);
    setIsViewDialogOpen(true);
  };

  // Stats calculations
  const totalPassengers = dummyPassengers.length;
  const malePassengers = dummyPassengers.filter(p => p.gender === "Male").length;
  const femalePassengers = dummyPassengers.filter(p => p.gender === "Female").length;
  const averageAge = Math.round(dummyPassengers.reduce((sum, p) => sum + p.age, 0) / totalPassengers);

  return (
    <div>
      <PageHeader
        title="Passenger Management"
        description="Track and manage passenger information and manifests"
        actions={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Passenger
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Passengers</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-users text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalPassengers}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Registered in system</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Male Passengers</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-male text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : malePassengers}
            </div>
            <div className="mt-1 text-sm text-blue-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((malePassengers / totalPassengers) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Female Passengers</div>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                <i className="fas fa-female text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : femalePassengers}
            </div>
            <div className="mt-1 text-sm text-pink-600">
              {isLoading ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round((femalePassengers / totalPassengers) * 100)}% of total`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Average Age</div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <i className="fas fa-chart-bar text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${averageAge} years`}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Across all passengers</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Passengers</TabsTrigger>
            <TabsTrigger value="active">Currently Traveling</TabsTrigger>
            <TabsTrigger value="history">Travel History</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search passengers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
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
                      <th className="text-left px-4 py-3 font-medium text-sm">Passenger Name</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Gender</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Age</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Contact</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">Manifest</th>
                      <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-8" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-9 w-20 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      filteredPassengers.map((passenger) => (
                        <tr key={passenger.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{passenger.fullName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <i className={`fas fa-${passenger.gender.toLowerCase()} mr-2 ${passenger.gender === "Male" ? "text-blue-500" : "text-pink-500"}`}></i>
                              <span>{passenger.gender}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {passenger.age}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <i className="fas fa-phone-alt mr-2 text-green-500"></i>
                              <span>{passenger.contactPhone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-primary">
                              MNF-{String(20230000 + passenger.manifestId).padStart(8, '0')}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewPassenger(passenger)}
                            >
                              <i className="fas fa-eye mr-1"></i> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {!isLoading && filteredPassengers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                          No passengers found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {filteredPassengers.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPassengers.length}</span> of <span className="font-medium">{filteredPassengers.length}</span> results
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
                <h3 className="text-lg font-medium mb-2">Currently Traveling Passengers</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This tab will show passengers who are currently traveling on active manifests.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <i className="fas fa-filter text-xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Passenger Travel History</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  This tab will show historical travel records for passengers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passenger Details</DialogTitle>
            <DialogDescription>
              Detailed information about the passenger
            </DialogDescription>
          </DialogHeader>
          
          {selectedPassenger && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className={`fas fa-${selectedPassenger.gender.toLowerCase()} text-3xl`}></i>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Full Name</div>
                  <div className="font-medium">{selectedPassenger.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Gender</div>
                  <div className="font-medium">{selectedPassenger.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Age</div>
                  <div className="font-medium">{selectedPassenger.age} years</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Manifest ID</div>
                  <div className="font-medium text-primary">MNF-{String(20230000 + selectedPassenger.manifestId).padStart(8, '0')}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Contact Phone</div>
                  <div className="font-medium">{selectedPassenger.contactPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Emergency Contact</div>
                  <div className="font-medium">{selectedPassenger.emergencyContact}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Travel Information</div>
                <div className="text-sm">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                    <span>Origin - Destination</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
                    <span>Travel Date: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-luggage-cart text-green-500 mr-2"></i>
                    <span>Luggage: 1 bag (5kg)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
