import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Park } from "@/lib/types";
import { cn } from "@/lib/utils";

type ParksTableProps = {
  isLoading: boolean;
  parks: Park[];
};

export default function ParksTable({ isLoading, parks }: ParksTableProps) {
  // Calculate the percentage for the progress bar
  const calculatePercentage = (current: number, total: number) => {
    return (current / total) * 100;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        <CardTitle className="text-lg font-bold">Parks & Terminals Registry</CardTitle>
        <div className="mt-3 sm:mt-0">
          <Button>
            <i className="fas fa-plus mr-1"></i> Add New Park
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Park Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Vehicles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-2 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Skeleton className="h-6 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                parks.map((park) => (
                  <tr key={park.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{park.name}</div>
                      <div className="text-xs text-neutral-500">ID: {park.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{park.location}</div>
                      <div className="text-xs text-neutral-500">{park.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{park.currentVehicles} / {park.capacity}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {park.passengerCapacity} passengers/day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        park.status === "active" ? "bg-green-100 text-green-800" : 
                        park.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      )}>
                        {park.status.charAt(0).toUpperCase() + park.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary-700 mr-3 h-8 w-8">
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700 h-8 w-8">
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-neutral-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{parks.length}</span> of <span className="font-medium">{parks.length}</span> results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
