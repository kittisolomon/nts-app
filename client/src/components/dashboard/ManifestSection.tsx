import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Manifest } from "@/lib/types";
import QRCodeGenerator from "@/components/manifest/QRCodeGenerator";

type ManifestSectionProps = {
  isLoading: boolean;
  manifests: Manifest[];
};

export default function ManifestSection({ isLoading, manifests }: ManifestSectionProps) {
  // Get the latest manifest for QR display
  const latestManifest = manifests.length > 0 ? manifests[0] : null;
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        <CardTitle className="text-lg font-bold">E-Manifest System</CardTitle>
        <div className="mt-3 sm:mt-0">
          <Button>
            Generate New Manifest
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Recent Manifests</h4>
              <ul className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <li key={i} className="flex items-start justify-between">
                      <div className="w-full">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </li>
                  ))
                ) : (
                  manifests.map((manifest) => (
                    <li key={manifest.id} className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-neutral-800">{manifest.manifestCode}</div>
                        <div className="text-xs text-neutral-500">
                          {/* TODO: Get origin and destination names from parks */}
                          Origin - Destination
                        </div>
                        <div className="text-xs text-neutral-600">{manifest.passengerCount} passengers</div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/90 h-8 w-8">
                          <i className="fas fa-eye"></i>
                        </Button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Manifest Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-neutral-500">Generated Today</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {isLoading ? <Skeleton className="h-7 w-10" /> : manifests.length}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-neutral-500">Active Manifests</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {isLoading ? (
                      <Skeleton className="h-7 w-10" />
                    ) : (
                      manifests.filter(m => m.status === "active").length
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-neutral-500">Passengers Today</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {isLoading ? (
                      <Skeleton className="h-7 w-16" />
                    ) : (
                      manifests.reduce((sum, manifest) => sum + manifest.passengerCount, 0)
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-neutral-500">Cargo (tons)</div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {isLoading ? (
                      <Skeleton className="h-7 w-12" />
                    ) : (
                      (manifests.reduce((sum, manifest) => sum + (manifest.cargoWeight || 0), 0) / 1000).toFixed(1)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-center items-center">
            <h4 className="text-sm font-medium text-neutral-900 mb-4">Sample QR Manifest</h4>
            
            {isLoading || !latestManifest ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-48 w-48 mb-3" />
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-60 mb-3" />
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ) : (
              <>
                <QRCodeGenerator value={latestManifest.manifestCode} size={192} />
                <div className="text-center">
                  <div className="text-sm font-medium text-neutral-800 mt-3">{latestManifest.manifestCode}</div>
                  <div className="text-xs text-neutral-600 mt-1 mb-3">
                    {/* TODO: Get origin and destination names from parks */}
                    Origin - Destination • {latestManifest.passengerCount} passengers
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <Button size="sm">
                      <i className="fas fa-download mr-1"></i> Download
                    </Button>
                    <Button variant="outline" size="sm" className="text-primary bg-primary/5 hover:bg-primary/10 border-primary/10">
                      <i className="fas fa-share-alt mr-1"></i> Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
