import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication and role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("operator"), // admin, operator, security, corporate
  agencyId: integer("agency_id"),
  corporateId: integer("corporate_id"),
});

// Security agencies
export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // police, immigration, road_safety, customs
  connectionStatus: text("connection_status").notNull().default("active"),
  activeConnections: integer("active_connections").notNull().default(0),
});

// Corporate entities (transport companies)
export const corporates = pgTable("corporates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subscription: text("subscription").notNull().default("basic"), // basic, premium
  fleetCount: integer("fleet_count").notNull().default(0),
});

// Parks and terminals
export const parks = pgTable("parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  capacity: integer("capacity").notNull(),
  currentVehicles: integer("current_vehicles").notNull().default(0),
  passengerCapacity: integer("passenger_capacity").notNull(),
  status: text("status").notNull().default("active"), // active, maintenance, closed
  coordinates: text("coordinates"), // Geolocation coordinates
});

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plateNumber: text("plate_number").notNull().unique(),
  model: text("model").notNull(),
  type: text("type").notNull(), // bus, van, truck
  seatingCapacity: integer("seating_capacity").notNull(),
  corporateId: integer("corporate_id"),
  driverId: integer("driver_id"),
  currentParkId: integer("current_park_id"),
  status: text("status").notNull().default("active"), // active, maintenance, inactive
  currentLocation: text("current_location"), // Geolocation coordinates
  destinationParkId: integer("destination_park_id"),
  expectedArrival: timestamp("expected_arrival"),
  currentRoute: text("current_route"),
  onboardPassengers: integer("onboard_passengers").default(0),
  trackingStatus: text("tracking_status").default("on_schedule"), // on_schedule, delayed, stopped, alert
});

// Drivers
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  contactPhone: text("contact_phone").notNull(),
  corporateId: integer("corporate_id"),
  status: text("status").notNull().default("active"), // active, suspended, inactive
});

// Manifests
export const manifests = pgTable("manifests", {
  id: serial("id").primaryKey(),
  manifestCode: text("manifest_code").notNull().unique(),
  vehicleId: integer("vehicle_id").notNull(),
  driverId: integer("driver_id").notNull(),
  originParkId: integer("origin_park_id").notNull(),
  destinationParkId: integer("destination_park_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  expectedArrivalTime: timestamp("expected_arrival_time").notNull(),
  passengerCount: integer("passenger_count").notNull().default(0),
  adultCount: integer("adult_count").notNull().default(0),
  childrenCount: integer("children_count").notNull().default(0),
  maleCount: integer("male_count").notNull().default(0),
  femaleCount: integer("female_count").notNull().default(0),
  cargoWeight: integer("cargo_weight").default(0), // in kg
  status: text("status").notNull().default("active"), // active, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Passengers
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  manifestId: integer("manifest_id").notNull(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  age: integer("age"),
  contactPhone: text("contact_phone"),
  luggage: jsonb("luggage"), // Details of luggage
  emergencyContact: text("emergency_contact"),
});

// Parcels/Logistics
export const parcels = pgTable("parcels", {
  id: serial("id").primaryKey(),
  trackingCode: text("tracking_code").notNull().unique(),
  manifestId: integer("manifest_id").notNull(),
  senderName: text("sender_name").notNull(),
  senderContact: text("sender_contact").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientContact: text("recipient_contact").notNull(),
  weight: integer("weight").notNull(), // in kg
  description: text("description").notNull(),
  status: text("status").notNull().default("in_transit"), // in_transit, delivered, returned
  verificationStatus: text("verification_status").notNull().default("verified"), // verified, pending, rejected
});

// Traffic reports
export const trafficReports = pgTable("traffic_reports", {
  id: serial("id").primaryKey(),
  route: text("route").notNull(),
  vehicleCount: integer("vehicle_count").notNull(),
  congestionLevel: text("congestion_level").notNull(), // low, medium, high
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  predictedTrend: text("predicted_trend"), // increasing, decreasing, stable
});

// Security alerts
export const securityAlerts = pgTable("security_alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  vehicleId: integer("vehicle_id"),
  location: text("location"),
  agencyId: integer("agency_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull().default("active"), // active, resolved, false_alarm
});

// Violations
export const violations = pgTable("violations", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  driverId: integer("driver_id"),
  type: text("type").notNull(), // speeding, overloading, documentation
  description: text("description").notNull(),
  location: text("location"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  reportedBy: integer("reported_by").notNull(), // user ID
  status: text("status").notNull().default("reported"), // reported, under_review, resolved
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAgencySchema = createInsertSchema(agencies).omit({ id: true });
export const insertCorporateSchema = createInsertSchema(corporates).omit({ id: true });
export const insertParkSchema = createInsertSchema(parks).omit({ id: true });
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export const insertDriverSchema = createInsertSchema(drivers).omit({ id: true });
export const insertManifestSchema = createInsertSchema(manifests).omit({ id: true, createdAt: true });
export const insertPassengerSchema = createInsertSchema(passengers).omit({ id: true });
export const insertParcelSchema = createInsertSchema(parcels).omit({ id: true });
export const insertTrafficReportSchema = createInsertSchema(trafficReports).omit({ id: true, timestamp: true });
export const insertSecurityAlertSchema = createInsertSchema(securityAlerts).omit({ id: true, timestamp: true });
export const insertViolationSchema = createInsertSchema(violations).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Agency = typeof agencies.$inferSelect;
export type InsertAgency = z.infer<typeof insertAgencySchema>;

export type Corporate = typeof corporates.$inferSelect;
export type InsertCorporate = z.infer<typeof insertCorporateSchema>;

export type Park = typeof parks.$inferSelect;
export type InsertPark = z.infer<typeof insertParkSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;

export type Manifest = typeof manifests.$inferSelect;
export type InsertManifest = z.infer<typeof insertManifestSchema>;

export type Passenger = typeof passengers.$inferSelect;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;

export type Parcel = typeof parcels.$inferSelect;
export type InsertParcel = z.infer<typeof insertParcelSchema>;

export type TrafficReport = typeof trafficReports.$inferSelect;
export type InsertTrafficReport = z.infer<typeof insertTrafficReportSchema>;

export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = z.infer<typeof insertSecurityAlertSchema>;

export type Violation = typeof violations.$inferSelect;
export type InsertViolation = z.infer<typeof insertViolationSchema>;
