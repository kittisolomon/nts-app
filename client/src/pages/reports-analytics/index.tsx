import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Filter, Download, Printer, Upload } from "lucide-react";

// Sample analytics data for UI display
const vehicleAnalytics = [
  { month: 'Jan', active: 1200, inactive: 200, maintenance: 150 },
  { month: 'Feb', active: 1350, inactive: 180, maintenance: 170 },
  { month: 'Mar', active: 1400, inactive: 220, maintenance: 140 },
  { month: 'Apr', active: 1600, inactive: 240, maintenance: 180 },
  { month: 'May', active: 1800, inactive: 260, maintenance: 200 },
  { month: 'Jun', active: 2200, inactive: 280, maintenance: 220 },
];

const passengerTrends = [
  { month: 'Jan', passengers: 28000 },
  { month: 'Feb', passengers: 32000 },
  { month: 'Mar', passengers: 35000 },
  { month: 'Apr', passengers: 40000 },
  { month: 'May', passengers: 45000 },
  { month: 'Jun', passengers: 52000 },
];

const routePerformance = [
  { name: 'Lagos-Abuja', value: 35 },
  { name: 'Lagos-PH', value: 25 },
  { name: 'Abuja-Kaduna', value: 15 },
  { name: 'Enugu-Onitsha', value: 10 },
  { name: 'Kano-Kaduna', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("last_30_days");
  const [reportType, setReportType] = useState("all");

  const { data: manifests, isLoading: isLoadingManifests } = useQuery({
    queryKey: ['https://nts-app.onrender.com/api/manifests'],
  });
  
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['https://nts-app.onrender.com/api/vehicles'],
  });
  
  const { data: parks, isLoading: isLoadingParks } = useQuery({
    queryKey: ['https://nts-app.onrender.com/api/parks'],
  });
  
  const { data: trafficReports, isLoading: isLoadingTrafficReports } = useQuery({
    queryKey: ['https://nts-app.onrender.com/api/traffic-reports'],
  });
  
  // Calculate summary stats
  const totalVehicles = vehicles?.length || 0;
  const totalPassengers = manifests?.reduce((sum, m) => sum + m.passengerCount, 0) || 0;
  const totalParks = parks?.length || 0;
  const totalRoutes = trafficReports?.length || 0;

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive analytics and reporting for transport operations"
        actions={
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Vehicles</div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-bus text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingVehicles ? <Skeleton className="h-8 w-16" /> : totalVehicles}
            </div>
            <div className="mt-1 text-sm text-neutral-500">Registered in system</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Total Passengers</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-users text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingManifests ? <Skeleton className="h-8 w-16" /> : totalPassengers}
            </div>
            <div className="mt-1 text-sm text-blue-600">
              {isLoadingManifests ? <Skeleton className="h-4 w-24" /> : 
                `${Math.round(totalPassengers / (manifests?.length || 1))} per manifest`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Parks & Terminals</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className="fas fa-building text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingParks ? <Skeleton className="h-8 w-16" /> : totalParks}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {isLoadingParks ? <Skeleton className="h-4 w-24" /> : 
                `${parks?.filter(p => p.status === 'active').length || 0} active`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-neutral-500">Active Routes</div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <i className="fas fa-route text-lg"></i>
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isLoadingTrafficReports ? <Skeleton className="h-8 w-16" /> : totalRoutes}
            </div>
            <div className="mt-1 text-sm text-orange-600">
              {isLoadingTrafficReports ? <Skeleton className="h-4 w-24" /> : 
                `${trafficReports?.filter(r => r.congestionLevel === 'high').length || 0} high traffic`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="passengers">Passengers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold">Analytics Dashboard</div>
          
          <div className="flex items-center space-x-2">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehicleAnalytics}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="active" stackId="a" fill="#3B82F6" name="Active" />
                    <Bar dataKey="maintenance" stackId="a" fill="#FBBF24" name="Maintenance" />
                    <Bar dataKey="inactive" stackId="a" fill="#EF4444" name="Inactive" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Passenger Count</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={passengerTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="passengers" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Route Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={routePerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {routePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4">Operational Efficiency</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Vehicle Utilization</div>
                            <div className="text-sm font-medium">78%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">On-Time Departures</div>
                            <div className="text-sm font-medium">92%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Manifest Completion</div>
                            <div className="text-sm font-medium">85%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-4">Safety Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Violation Rate</div>
                            <div className="text-sm font-medium">3.2%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: '3.2%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Documentation Compliance</div>
                            <div className="text-sm font-medium">97%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: '97%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Security Alert Resolution</div>
                            <div className="text-sm font-medium">89%</div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full" style={{ width: '89%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-4">Key Insights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <i className="fas fa-chart-line text-primary mt-0.5 mr-2"></i>
                        <span>Passenger volumes increased by 15% compared to the previous period</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-2"></i>
                        <span>Lagos-Abuja route experiencing higher than average delays</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-thumbs-up text-green-500 mt-0.5 mr-2"></i>
                        <span>Southern region shows 23% improvement in compliance metrics</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-bolt text-purple-500 mt-0.5 mr-2"></i>
                        <span>Weekend traffic patterns show consistent 30% increase in passenger volume</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center py-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="fas fa-bus text-3xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Vehicle Analytics</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                Detailed analytics and reports for vehicle performance, maintenance history, and operational efficiency.
              </p>
              <Button>View Vehicle Analytics</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="passengers" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center py-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="fas fa-users text-3xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Passenger Analytics</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                In-depth analysis of passenger demographics, travel patterns, and service usage metrics.
              </p>
              <Button>View Passenger Analytics</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routes" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center py-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="fas fa-route text-3xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Route Analytics</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                Comprehensive analysis of route performance, traffic patterns, and operational efficiency.
              </p>
              <Button>View Route Analytics</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="violations" className="mt-0">
          <Card>
            <CardContent className="p-6 text-center py-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="fas fa-exclamation-triangle text-3xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">Violation Analytics</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                Detailed analysis of violations, compliance metrics, and safety performance trends.
              </p>
              <Button>View Violation Analytics</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Monthly Operations Report</div>
                  <div className="text-xs text-neutral-500">Last generated: June 10, 2023</div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
                  <i className="fas fa-download"></i>
                </Button>
              </div>
              
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Quarterly Performance Summary</div>
                  <div className="text-xs text-neutral-500">Last generated: May 31, 2023</div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
                  <i className="fas fa-download"></i>
                </Button>
              </div>
              
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                  <i className="fas fa-users"></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Passenger Demographics Analysis</div>
                  <div className="text-xs text-neutral-500">Last generated: June 5, 2023</div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
                  <i className="fas fa-download"></i>
                </Button>
              </div>
              
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Safety Incident Report</div>
                  <div className="text-xs text-neutral-500">Last generated: June 8, 2023</div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
                  <i className="fas fa-download"></i>
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <i className="fas fa-plus mr-2"></i> Generate New Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg">Data Import & Export</CardTitle>
              <div>
                <Select defaultValue="csv">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="File Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="font-medium">Import Data</div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Import data from external sources into the transport management system.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      <i className="fas fa-bus text-primary text-lg mb-1"></i>
                      <div className="text-xs font-medium">Vehicles</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      <i className="fas fa-users text-blue-600 text-lg mb-1"></i>
                      <div className="text-xs font-medium">Passengers</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      <i className="fas fa-building text-green-600 text-lg mb-1"></i>
                      <div className="text-xs font-medium">Parks</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      <i className="fas fa-route text-orange-600 text-lg mb-1"></i>
                      <div className="text-xs font-medium">Routes</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <i className="fas fa-upload mr-2"></i> Import Data
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="font-medium">Export Reports</div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Export analytics and reports for external use and distribution.
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <i className="fas fa-chart-bar text-primary mr-2"></i>
                        <span className="text-sm">Performance Analytics</span>
                      </div>
                      <i className="fas fa-chevron-right text-neutral-400"></i>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <i className="fas fa-money-bill-wave text-green-600 mr-2"></i>
                        <span className="text-sm">Financial Reports</span>
                      </div>
                      <i className="fas fa-chevron-right text-neutral-400"></i>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <i className="fas fa-shield-alt text-orange-600 mr-2"></i>
                        <span className="text-sm">Safety Compliance</span>
                      </div>
                      <i className="fas fa-chevron-right text-neutral-400"></i>
                    </div>
                  </div>
                  <Button className="w-full">
                    <i className="fas fa-download mr-2"></i> Export Reports
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <i className="fas fa-lightbulb text-xl"></i>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-blue-800 mb-1">Data Utilization Tip</div>
                    <div className="text-sm text-blue-700">
                      Regular data exports can be scheduled for automated reporting. Use the settings section to configure automated weekly or monthly reports delivered to stakeholders via email.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
