// Extended Date prototype to add toRelative method
declare global {
  interface Date {
    toRelative(): string;
  }
}

// Add a toRelative method to Date prototype
Date.prototype.toRelative = function() {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    // Format date string for older dates
    return this.toLocaleDateString();
  }
};

// User types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  agencyId?: number;
  corporateId?: number;
}

// Agency types
export interface Agency {
  id: number;
  name: string;
  type: string;
  connectionStatus: string;
  activeConnections: number;
}

// Corporate types
export interface Corporate {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  subscription: string;
  fleetCount: number;
}

// Park types
export interface Park {
  id: number;
  name: string;
  code: string;
  location: string;
  region: string;
  capacity: number;
  currentVehicles: number;
  passengerCapacity: number;
  status: string;
  coordinates?: string;
}

// Vehicle types
export interface Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  type: string;
  seatingCapacity: number;
  corporateId?: number;
  driverId?: number;
  currentParkId?: number;
  status: string;
  currentLocation?: string;
  destinationParkId?: number;
  expectedArrival?: string;
  currentRoute: string;
  onboardPassengers: number;
  trackingStatus: string;
}

// Driver types
export interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  contactPhone: string;
  corporateId?: number;
  status: string;
}

// Manifest types
export interface Manifest {
  id: number;
  manifestCode: string;
  vehicleId: number;
  driverId: number;
  originParkId: number;
  destinationParkId: number;
  departureTime: string;
  expectedArrivalTime: string;
  passengerCount: number;
  adultCount: number;
  childrenCount: number;
  maleCount: number;
  femaleCount: number;
  cargoWeight?: number;
  status: string;
  createdAt: string;
}

// Passenger types
export interface Passenger {
  id: number;
  manifestId: number;
  fullName: string;
  gender: string;
  age?: number;
  contactPhone?: string;
  luggage?: any;
  emergencyContact?: string;
}

// Parcel types
export interface Parcel {
  id: number;
  trackingCode: string;
  manifestId: number;
  senderName: string;
  senderContact: string;
  recipientName: string;
  recipientContact: string;
  weight: number;
  description: string;
  status: string;
  verificationStatus: string;
}

// Traffic report types
export interface TrafficReport {
  id: number;
  route: string;
  vehicleCount: number;
  congestionLevel: string;
  timestamp: string;
  predictedTrend?: string;
}

// Security alert types
export interface SecurityAlert {
  id: number;
  title: string;
  description: string;
  priority: string;
  vehicleId?: number;
  location?: string;
  agencyId?: number;
  timestamp: string;
  status: string;
}

// Violation types
export interface Violation {
  id: number;
  vehicleId: number;
  driverId?: number;
  type: string;
  description: string;
  location?: string;
  timestamp: string;
  reportedBy: number;
  status: string;
}

// Dashboard stats
export interface DashboardStats {
  activeVehicles: number;
  passengersToday: number;
  registeredParks: number;
  violationsToday: number;
}

export type VehicleStatus = "active" | "maintenance" | "inactive";
export type TrackingStatus = "on_schedule" | "delayed" | "stopped" | "alert";
export type ManifestStatus = "active" | "completed" | "cancelled";
export type ParkStatus = "active" | "maintenance" | "closed";
export type AlertPriority = "high" | "medium" | "low";
export type ViolationStatus = "reported" | "under_review" | "resolved";
