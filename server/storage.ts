import {
  User, InsertUser, Agency, InsertAgency, Corporate, InsertCorporate,
  Park, InsertPark, Vehicle, InsertVehicle, Driver, InsertDriver,
  Manifest, InsertManifest, Passenger, InsertPassenger, Parcel, InsertParcel,
  TrafficReport, InsertTrafficReport, SecurityAlert, InsertSecurityAlert,
  Violation, InsertViolation
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Agency operations
  getAgency(id: number): Promise<Agency | undefined>;
  getAgencies(): Promise<Agency[]>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  updateAgency(id: number, agency: Partial<Agency>): Promise<Agency | undefined>;
  
  // Corporate operations
  getCorporate(id: number): Promise<Corporate | undefined>;
  getCorporates(): Promise<Corporate[]>;
  createCorporate(corporate: InsertCorporate): Promise<Corporate>;
  updateCorporate(id: number, corporate: Partial<Corporate>): Promise<Corporate | undefined>;
  
  // Park operations
  getPark(id: number): Promise<Park | undefined>;
  getParkByCode(code: string): Promise<Park | undefined>;
  getParks(): Promise<Park[]>;
  createPark(park: InsertPark): Promise<Park>;
  updatePark(id: number, park: Partial<Park>): Promise<Park | undefined>;
  
  // Vehicle operations
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByPlate(plateNumber: string): Promise<Vehicle | undefined>;
  getVehicles(): Promise<Vehicle[]>;
  getActiveVehicles(): Promise<Vehicle[]>;
  getCorporateVehicles(corporateId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined>;
  
  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  getDrivers(): Promise<Driver[]>;
  getCorporateDrivers(corporateId: number): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined>;
  
  // Manifest operations
  getManifest(id: number): Promise<Manifest | undefined>;
  getManifestByCode(manifestCode: string): Promise<Manifest | undefined>;
  getManifests(): Promise<Manifest[]>;
  getRecentManifests(limit: number): Promise<Manifest[]>;
  createManifest(manifest: InsertManifest): Promise<Manifest>;
  updateManifest(id: number, manifest: Partial<Manifest>): Promise<Manifest | undefined>;
  
  // Passenger operations
  getPassenger(id: number): Promise<Passenger | undefined>;
  getManifestPassengers(manifestId: number): Promise<Passenger[]>;
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  
  // Parcel operations
  getParcel(id: number): Promise<Parcel | undefined>;
  getParcelByTrackingCode(trackingCode: string): Promise<Parcel | undefined>;
  getManifestParcels(manifestId: number): Promise<Parcel[]>;
  createParcel(parcel: InsertParcel): Promise<Parcel>;
  updateParcel(id: number, parcel: Partial<Parcel>): Promise<Parcel | undefined>;
  
  // Traffic report operations
  getTrafficReport(id: number): Promise<TrafficReport | undefined>;
  getTrafficReports(): Promise<TrafficReport[]>;
  getRecentTrafficReports(limit: number): Promise<TrafficReport[]>;
  createTrafficReport(report: InsertTrafficReport): Promise<TrafficReport>;
  
  // Security alert operations
  getSecurityAlert(id: number): Promise<SecurityAlert | undefined>;
  getSecurityAlerts(): Promise<SecurityAlert[]>;
  getRecentSecurityAlerts(limit: number): Promise<SecurityAlert[]>;
  createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert>;
  updateSecurityAlert(id: number, alert: Partial<SecurityAlert>): Promise<SecurityAlert | undefined>;
  
  // Violation operations
  getViolation(id: number): Promise<Violation | undefined>;
  getViolations(): Promise<Violation[]>;
  getVehicleViolations(vehicleId: number): Promise<Violation[]>;
  getRecentViolations(limit: number): Promise<Violation[]>;
  createViolation(violation: InsertViolation): Promise<Violation>;
  updateViolation(id: number, violation: Partial<Violation>): Promise<Violation | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private agencies: Map<number, Agency>;
  private corporates: Map<number, Corporate>;
  private parks: Map<number, Park>;
  private vehicles: Map<number, Vehicle>;
  private drivers: Map<number, Driver>;
  private manifests: Map<number, Manifest>;
  private passengers: Map<number, Passenger>;
  private parcels: Map<number, Parcel>;
  private trafficReports: Map<number, TrafficReport>;
  private securityAlerts: Map<number, SecurityAlert>;
  private violations: Map<number, Violation>;
  
  private userId: number;
  private agencyId: number;
  private corporateId: number;
  private parkId: number;
  private vehicleId: number;
  private driverId: number;
  private manifestId: number;
  private passengerId: number;
  private parcelId: number;
  private trafficReportId: number;
  private securityAlertId: number;
  private violationId: number;
  
  constructor() {
    // Initialize maps
    this.users = new Map();
    this.agencies = new Map();
    this.corporates = new Map();
    this.parks = new Map();
    this.vehicles = new Map();
    this.drivers = new Map();
    this.manifests = new Map();
    this.passengers = new Map();
    this.parcels = new Map();
    this.trafficReports = new Map();
    this.securityAlerts = new Map();
    this.violations = new Map();
    
    // Initialize IDs
    this.userId = 1;
    this.agencyId = 1;
    this.corporateId = 1;
    this.parkId = 1;
    this.vehicleId = 1;
    this.driverId = 1;
    this.manifestId = 1;
    this.passengerId = 1;
    this.parcelId = 1;
    this.trafficReportId = 1;
    this.securityAlertId = 1;
    this.violationId = 1;
    
    // Add seed data
    this.seedData();
  }
  
  private seedData() {
    // Create demo admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Admin User",
      email: "admin@visionone.com",
      role: "admin"
    });
    
    // Create security agencies
    const agencies = [
      { name: "Nigeria Police Force", type: "police", connectionStatus: "active", activeConnections: 87 },
      { name: "Immigration Service", type: "immigration", connectionStatus: "active", activeConnections: 42 },
      { name: "Road Safety Corps", type: "road_safety", connectionStatus: "active", activeConnections: 104 },
      { name: "Customs Service", type: "customs", connectionStatus: "active", activeConnections: 36 }
    ];
    
    agencies.forEach(agency => this.createAgency(agency));
    
    // Create parks
    const parks = [
      { name: "Jibowu Central Park", code: "PRK-001-LG", location: "Lagos", region: "South West", capacity: 120, passengerCapacity: 1200, currentVehicles: 78, status: "active", coordinates: "6.5244,3.3792" },
      { name: "Utako Modern Park", code: "PRK-023-AB", location: "Abuja", region: "FCT", capacity: 95, passengerCapacity: 850, currentVehicles: 45, status: "active", coordinates: "9.0765,7.4815" },
      { name: "Mile 3 Transport Hub", code: "PRK-045-PH", location: "Port Harcourt", region: "South South", capacity: 80, passengerCapacity: 720, currentVehicles: 62, status: "active", coordinates: "4.8156,7.0498" },
      { name: "New Market Park", code: "PRK-067-EN", location: "Enugu", region: "South East", capacity: 60, passengerCapacity: 550, currentVehicles: 35, status: "maintenance", coordinates: "6.4584,7.5464" },
      { name: "Central Motor Park", code: "PRK-092-KD", location: "Kaduna", region: "North West", capacity: 75, passengerCapacity: 680, currentVehicles: 58, status: "active", coordinates: "10.5222,7.4383" }
    ];
    
    parks.forEach(park => this.createPark(park));
    
    // Create vehicles
    const vehicles = [
      { plateNumber: "ABC-123-XY", model: "Toyota Hiace", type: "bus", seatingCapacity: 14, currentParkId: 1, status: "active", currentLocation: "6.5244,3.3792", destinationParkId: 2, currentRoute: "Lagos to Abuja", onboardPassengers: 12, trackingStatus: "on_schedule" },
      { plateNumber: "DEF-456-YZ", model: "Mercedes Sprinter", type: "bus", seatingCapacity: 18, currentParkId: 3, status: "active", currentLocation: "4.8156,7.0498", destinationParkId: 4, currentRoute: "Enugu to Port Harcourt", onboardPassengers: 18, trackingStatus: "delayed" },
      { plateNumber: "GHI-789-AB", model: "Iveco Bus", type: "bus", seatingCapacity: 30, currentParkId: 5, status: "active", currentLocation: "10.5222,7.4383", destinationParkId: 2, currentRoute: "Kaduna to Kano", onboardPassengers: 22, trackingStatus: "on_schedule" },
      { plateNumber: "JKL-012-CD", model: "Scania Bus", type: "bus", seatingCapacity: 45, currentParkId: 2, status: "active", currentLocation: "9.0765,7.4815", destinationParkId: 5, currentRoute: "Abuja to Jos", onboardPassengers: 36, trackingStatus: "stopped" },
      { plateNumber: "MNO-345-EF", model: "Toyota Coaster", type: "bus", seatingCapacity: 25, currentParkId: 4, status: "active", currentLocation: "6.4584,7.5464", destinationParkId: 3, currentRoute: "Benin to Asaba", onboardPassengers: 15, trackingStatus: "alert" }
    ];
    
    vehicles.forEach(vehicle => this.createVehicle(vehicle));
    
    // Create manifests
    const now = new Date();
    const manifests = [
      { manifestCode: "MNF-20230812-0045", vehicleId: 1, driverId: 1, originParkId: 1, destinationParkId: 2, departureTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), expectedArrivalTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), passengerCount: 14, adultCount: 12, childrenCount: 2, maleCount: 8, femaleCount: 6, status: "active" },
      { manifestCode: "MNF-20230812-0044", vehicleId: 2, driverId: 2, originParkId: 3, destinationParkId: 4, departureTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), expectedArrivalTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), passengerCount: 8, adultCount: 7, childrenCount: 1, maleCount: 5, femaleCount: 3, status: "active" },
      { manifestCode: "MNF-20230812-0043", vehicleId: 3, driverId: 3, originParkId: 5, destinationParkId: 2, departureTime: new Date(now.getTime() - 3 * 60 * 60 * 1000), expectedArrivalTime: new Date(now.getTime() + 1 * 60 * 60 * 1000), passengerCount: 22, adultCount: 20, childrenCount: 2, maleCount: 12, femaleCount: 10, status: "active" },
      { manifestCode: "MNF-20230812-0042", vehicleId: 4, driverId: 4, originParkId: 1, destinationParkId: 4, departureTime: new Date(now.getTime() - 5 * 60 * 60 * 1000), expectedArrivalTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), passengerCount: 16, adultCount: 14, childrenCount: 2, maleCount: 9, femaleCount: 7, status: "active" }
    ];
    
    manifests.forEach(manifest => this.createManifest(manifest));
    
    // Create traffic reports
    const trafficReports = [
      { route: "Lagos - Ibadan", vehicleCount: 342, congestionLevel: "high", predictedTrend: "increasing" },
      { route: "Abuja - Kaduna", vehicleCount: 254, congestionLevel: "medium", predictedTrend: "stable" },
      { route: "Port Harcourt - Aba", vehicleCount: 187, congestionLevel: "medium", predictedTrend: "decreasing" }
    ];
    
    trafficReports.forEach(report => this.createTrafficReport(report));
    
    // Create security alerts
    const securityAlerts = [
      { title: "High Priority Alert", description: "Vehicle XYZ-123-AB reported suspicious activity", priority: "high", location: "Lagos-Ore Highway", agencyId: 1, status: "active" },
      { title: "Medium Priority Alert", description: "4 unregistered passengers detected on LMN-567-CD", priority: "medium", location: "Abuja Expressway", agencyId: 2, status: "active" },
      { title: "Information Notice", description: "Checkpoint established on Abuja-Kaduna highway", priority: "low", location: "Abuja-Kaduna Highway", agencyId: 3, status: "active" }
    ];
    
    securityAlerts.forEach(alert => this.createSecurityAlert(alert));
    
    // Create drivers (needed for manifests)
    const drivers = [
      { fullName: "John Doe", licenseNumber: "DRV-001-NG", contactPhone: "08012345678", status: "active" },
      { fullName: "Jane Smith", licenseNumber: "DRV-002-NG", contactPhone: "08023456789", status: "active" },
      { fullName: "Peter Obi", licenseNumber: "DRV-003-NG", contactPhone: "08034567890", status: "active" },
      { fullName: "Mary Johnson", licenseNumber: "DRV-004-NG", contactPhone: "08045678901", status: "active" }
    ];
    
    drivers.forEach((driver, index) => {
      const created = this.createDriver(driver);
      // Update vehicle driver ID
      if (index < vehicles.length) {
        this.updateVehicle(index + 1, { driverId: created.id });
      }
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Agency operations
  async getAgency(id: number): Promise<Agency | undefined> {
    return this.agencies.get(id);
  }
  
  async getAgencies(): Promise<Agency[]> {
    return Array.from(this.agencies.values());
  }
  
  async createAgency(agency: InsertAgency): Promise<Agency> {
    const id = this.agencyId++;
    const newAgency: Agency = { ...agency, id };
    this.agencies.set(id, newAgency);
    return newAgency;
  }
  
  async updateAgency(id: number, agency: Partial<Agency>): Promise<Agency | undefined> {
    const existingAgency = this.agencies.get(id);
    if (!existingAgency) return undefined;
    
    const updatedAgency = { ...existingAgency, ...agency };
    this.agencies.set(id, updatedAgency);
    return updatedAgency;
  }
  
  // Corporate operations
  async getCorporate(id: number): Promise<Corporate | undefined> {
    return this.corporates.get(id);
  }
  
  async getCorporates(): Promise<Corporate[]> {
    return Array.from(this.corporates.values());
  }
  
  async createCorporate(corporate: InsertCorporate): Promise<Corporate> {
    const id = this.corporateId++;
    const newCorporate: Corporate = { ...corporate, id };
    this.corporates.set(id, newCorporate);
    return newCorporate;
  }
  
  async updateCorporate(id: number, corporate: Partial<Corporate>): Promise<Corporate | undefined> {
    const existingCorporate = this.corporates.get(id);
    if (!existingCorporate) return undefined;
    
    const updatedCorporate = { ...existingCorporate, ...corporate };
    this.corporates.set(id, updatedCorporate);
    return updatedCorporate;
  }
  
  // Park operations
  async getPark(id: number): Promise<Park | undefined> {
    return this.parks.get(id);
  }
  
  async getParkByCode(code: string): Promise<Park | undefined> {
    return Array.from(this.parks.values()).find(park => park.code === code);
  }
  
  async getParks(): Promise<Park[]> {
    return Array.from(this.parks.values());
  }
  
  async createPark(park: InsertPark): Promise<Park> {
    const id = this.parkId++;
    const newPark: Park = { ...park, id };
    this.parks.set(id, newPark);
    return newPark;
  }
  
  async updatePark(id: number, park: Partial<Park>): Promise<Park | undefined> {
    const existingPark = this.parks.get(id);
    if (!existingPark) return undefined;
    
    const updatedPark = { ...existingPark, ...park };
    this.parks.set(id, updatedPark);
    return updatedPark;
  }
  
  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }
  
  async getVehicleByPlate(plateNumber: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find(vehicle => vehicle.plateNumber === plateNumber);
  }
  
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }
  
  async getActiveVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(vehicle => vehicle.status === "active");
  }
  
  async getCorporateVehicles(corporateId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(vehicle => vehicle.corporateId === corporateId);
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleId++;
    const newVehicle: Vehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }
  
  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const existingVehicle = this.vehicles.get(id);
    if (!existingVehicle) return undefined;
    
    const updatedVehicle = { ...existingVehicle, ...vehicle };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }
  
  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }
  
  async getDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }
  
  async getCorporateDrivers(corporateId: number): Promise<Driver[]> {
    return Array.from(this.drivers.values()).filter(driver => driver.corporateId === corporateId);
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    const id = this.driverId++;
    const newDriver: Driver = { ...driver, id };
    this.drivers.set(id, newDriver);
    return newDriver;
  }
  
  async updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined> {
    const existingDriver = this.drivers.get(id);
    if (!existingDriver) return undefined;
    
    const updatedDriver = { ...existingDriver, ...driver };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  
  // Manifest operations
  async getManifest(id: number): Promise<Manifest | undefined> {
    return this.manifests.get(id);
  }
  
  async getManifestByCode(manifestCode: string): Promise<Manifest | undefined> {
    return Array.from(this.manifests.values()).find(manifest => manifest.manifestCode === manifestCode);
  }
  
  async getManifests(): Promise<Manifest[]> {
    return Array.from(this.manifests.values());
  }
  
  async getRecentManifests(limit: number): Promise<Manifest[]> {
    return Array.from(this.manifests.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async createManifest(manifest: InsertManifest): Promise<Manifest> {
    const id = this.manifestId++;
    const newManifest: Manifest = { ...manifest, id, createdAt: new Date() };
    this.manifests.set(id, newManifest);
    return newManifest;
  }
  
  async updateManifest(id: number, manifest: Partial<Manifest>): Promise<Manifest | undefined> {
    const existingManifest = this.manifests.get(id);
    if (!existingManifest) return undefined;
    
    const updatedManifest = { ...existingManifest, ...manifest };
    this.manifests.set(id, updatedManifest);
    return updatedManifest;
  }
  
  // Passenger operations
  async getPassenger(id: number): Promise<Passenger | undefined> {
    return this.passengers.get(id);
  }
  
  async getManifestPassengers(manifestId: number): Promise<Passenger[]> {
    return Array.from(this.passengers.values()).filter(passenger => passenger.manifestId === manifestId);
  }
  
  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    const id = this.passengerId++;
    const newPassenger: Passenger = { ...passenger, id };
    this.passengers.set(id, newPassenger);
    return newPassenger;
  }
  
  // Parcel operations
  async getParcel(id: number): Promise<Parcel | undefined> {
    return this.parcels.get(id);
  }
  
  async getParcelByTrackingCode(trackingCode: string): Promise<Parcel | undefined> {
    return Array.from(this.parcels.values()).find(parcel => parcel.trackingCode === trackingCode);
  }
  
  async getManifestParcels(manifestId: number): Promise<Parcel[]> {
    return Array.from(this.parcels.values()).filter(parcel => parcel.manifestId === manifestId);
  }
  
  async createParcel(parcel: InsertParcel): Promise<Parcel> {
    const id = this.parcelId++;
    const newParcel: Parcel = { ...parcel, id };
    this.parcels.set(id, newParcel);
    return newParcel;
  }
  
  async updateParcel(id: number, parcel: Partial<Parcel>): Promise<Parcel | undefined> {
    const existingParcel = this.parcels.get(id);
    if (!existingParcel) return undefined;
    
    const updatedParcel = { ...existingParcel, ...parcel };
    this.parcels.set(id, updatedParcel);
    return updatedParcel;
  }
  
  // Traffic report operations
  async getTrafficReport(id: number): Promise<TrafficReport | undefined> {
    return this.trafficReports.get(id);
  }
  
  async getTrafficReports(): Promise<TrafficReport[]> {
    return Array.from(this.trafficReports.values());
  }
  
  async getRecentTrafficReports(limit: number): Promise<TrafficReport[]> {
    return Array.from(this.trafficReports.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async createTrafficReport(report: InsertTrafficReport): Promise<TrafficReport> {
    const id = this.trafficReportId++;
    const newReport: TrafficReport = { ...report, id, timestamp: new Date() };
    this.trafficReports.set(id, newReport);
    return newReport;
  }
  
  // Security alert operations
  async getSecurityAlert(id: number): Promise<SecurityAlert | undefined> {
    return this.securityAlerts.get(id);
  }
  
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return Array.from(this.securityAlerts.values());
  }
  
  async getRecentSecurityAlerts(limit: number): Promise<SecurityAlert[]> {
    return Array.from(this.securityAlerts.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> {
    const id = this.securityAlertId++;
    const newAlert: SecurityAlert = { ...alert, id, timestamp: new Date() };
    this.securityAlerts.set(id, newAlert);
    return newAlert;
  }
  
  async updateSecurityAlert(id: number, alert: Partial<SecurityAlert>): Promise<SecurityAlert | undefined> {
    const existingAlert = this.securityAlerts.get(id);
    if (!existingAlert) return undefined;
    
    const updatedAlert = { ...existingAlert, ...alert };
    this.securityAlerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Violation operations
  async getViolation(id: number): Promise<Violation | undefined> {
    return this.violations.get(id);
  }
  
  async getViolations(): Promise<Violation[]> {
    return Array.from(this.violations.values());
  }
  
  async getVehicleViolations(vehicleId: number): Promise<Violation[]> {
    return Array.from(this.violations.values()).filter(violation => violation.vehicleId === vehicleId);
  }
  
  async getRecentViolations(limit: number): Promise<Violation[]> {
    return Array.from(this.violations.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async createViolation(violation: InsertViolation): Promise<Violation> {
    const id = this.violationId++;
    const newViolation: Violation = { ...violation, id, timestamp: new Date() };
    this.violations.set(id, newViolation);
    return newViolation;
  }
  
  async updateViolation(id: number, violation: Partial<Violation>): Promise<Violation | undefined> {
    const existingViolation = this.violations.get(id);
    if (!existingViolation) return undefined;
    
    const updatedViolation = { ...existingViolation, ...violation };
    this.violations.set(id, updatedViolation);
    return updatedViolation;
  }
}

export const storage = new MemStorage();
