import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import MemoryStore from "memorystore";
import { insertManifestSchema, insertParkSchema, insertVehicleSchema, insertSecurityAlertSchema, insertViolationSchema } from "@shared/schema";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
      secret: process.env.SESSION_SECRET || "session-secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000, // 24 hours
      }),
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth endpoints
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/current-user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      const activeVehicles = vehicles.filter(v => v.status === "active");
      
      const parks = await storage.getParks();
      const registeredParks = parks.length;
      
      // Calculate passengers today (sum of all active manifests)
      const manifests = await storage.getManifests();
      const activeManifests = manifests.filter(m => m.status === "active");
      const passengersToday = activeManifests.reduce((sum, manifest) => sum + manifest.passengerCount, 0);
      
      // Get violations today
      const violations = await storage.getViolations();
      const violationsToday = violations.length;
      
      res.json({
        activeVehicles: activeVehicles.length,
        passengersToday,
        registeredParks,
        violationsToday
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });

  // Vehicle endpoints
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  app.get("/api/vehicles/active", async (req, res) => {
    try {
      const vehicles = await storage.getActiveVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Error fetching vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const newVehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(newVehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const updatedVehicle = await storage.updateVehicle(id, req.body);
      res.json(updatedVehicle);
    } catch (error) {
      res.status(500).json({ message: "Error updating vehicle" });
    }
  });

  // Park endpoints
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getParks();
      res.json(parks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching parks" });
    }
  });

  app.get("/api/parks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const park = await storage.getPark(id);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      res.json(park);
    } catch (error) {
      res.status(500).json({ message: "Error fetching park" });
    }
  });

  app.post("/api/parks", async (req, res) => {
    try {
      const parkData = insertParkSchema.parse(req.body);
      const newPark = await storage.createPark(parkData);
      res.status(201).json(newPark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid park data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating park" });
    }
  });

  app.patch("/api/parks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const park = await storage.getPark(id);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      
      const updatedPark = await storage.updatePark(id, req.body);
      res.json(updatedPark);
    } catch (error) {
      res.status(500).json({ message: "Error updating park" });
    }
  });

  // Manifest endpoints
  app.get("/api/manifests", async (req, res) => {
    try {
      const manifests = await storage.getManifests();
      res.json(manifests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manifests" });
    }
  });

  app.get("/api/manifests/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const manifests = await storage.getRecentManifests(limit);
      res.json(manifests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent manifests" });
    }
  });

  app.get("/api/manifests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const manifest = await storage.getManifest(id);
      if (!manifest) {
        return res.status(404).json({ message: "Manifest not found" });
      }
      res.json(manifest);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manifest" });
    }
  });

  app.post("/api/manifests", async (req, res) => {
    try {
      const manifestData = insertManifestSchema.parse(req.body);
      
      // Generate a unique manifest code
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const manifestCode = `MNF-${dateStr}-${randomNum}`;
      
      const newManifest = await storage.createManifest({
        ...manifestData,
        manifestCode
      });
      
      res.status(201).json(newManifest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid manifest data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating manifest" });
    }
  });

  app.patch("/api/manifests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const manifest = await storage.getManifest(id);
      if (!manifest) {
        return res.status(404).json({ message: "Manifest not found" });
      }
      
      const updatedManifest = await storage.updateManifest(id, req.body);
      res.json(updatedManifest);
    } catch (error) {
      res.status(500).json({ message: "Error updating manifest" });
    }
  });

  // Traffic report endpoints
  app.get("/api/traffic-reports", async (req, res) => {
    try {
      const reports = await storage.getTrafficReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Error fetching traffic reports" });
    }
  });

  app.get("/api/traffic-reports/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const reports = await storage.getRecentTrafficReports(limit);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent traffic reports" });
    }
  });

  // Security alerts endpoints
  app.get("/api/security-alerts", async (req, res) => {
    try {
      const alerts = await storage.getSecurityAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching security alerts" });
    }
  });

  app.get("/api/security-alerts/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const alerts = await storage.getRecentSecurityAlerts(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent security alerts" });
    }
  });

  app.post("/api/security-alerts", async (req, res) => {
    try {
      const alertData = insertSecurityAlertSchema.parse(req.body);
      const newAlert = await storage.createSecurityAlert(alertData);
      res.status(201).json(newAlert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating security alert" });
    }
  });

  // Violations endpoints
  app.get("/api/violations", async (req, res) => {
    try {
      const violations = await storage.getViolations();
      res.json(violations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching violations" });
    }
  });

  app.get("/api/violations/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const violations = await storage.getRecentViolations(limit);
      res.json(violations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent violations" });
    }
  });

  app.post("/api/violations", async (req, res) => {
    try {
      const violationData = insertViolationSchema.parse(req.body);
      const newViolation = await storage.createViolation(violationData);
      res.status(201).json(newViolation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid violation data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating violation" });
    }
  });

  // Agencies endpoints
  app.get("/api/agencies", async (req, res) => {
    try {
      const agencies = await storage.getAgencies();
      res.json(agencies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching agencies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
