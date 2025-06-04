import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Agency, SecurityAlert } from "@/lib/types";
import { cn } from "@/lib/utils";

type SecuritySectionProps = {
  isLoadingAgencies: boolean;
  isLoadingAlerts: boolean;
  agencies: Agency[];
  alerts: SecurityAlert[];
};

export default function SecuritySection({ 
  isLoadingAgencies, 
  isLoadingAlerts, 
  agencies, 
  alerts 
}: SecuritySectionProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-bold">Security Integration</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Connected Agencies</h4>
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
              agencies.map((agency) => (
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
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Recent Security Alerts</h4>
          <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
            {isLoadingAlerts ? (
              Array(3).fill(0).map((_, i) => (
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
              alerts.map((alert) => {
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
                
                return (
                  <div key={alert.id} className={cn("p-3 border rounded-lg", priorityClass)}>
                    <div className="flex items-start">
                      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3", iconClass)}>
                        <i className={icon}></i>
                      </div>
                      <div>
                        <div className={cn("text-sm font-medium", textClass)}>
                          {alert.priority === 'high' ? 'High Priority Alert' : 
                           alert.priority === 'medium' ? 'Medium Priority Alert' : 
                           'Information Notice'}
                        </div>
                        <div className={cn("text-xs", descriptionClass)}>{alert.description}</div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {(() => {
                            try {
                              return new Date(alert.timestamp).toRelative();
                            } catch (e) {
                              // Fallback if toRelative is not available
                              return new Date(alert.timestamp).toLocaleDateString();
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
