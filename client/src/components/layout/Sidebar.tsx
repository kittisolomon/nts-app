import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  icon: string;
  children: React.ReactNode;
  active?: boolean;
};

const SidebarItem = ({ href, icon, children, active }: SidebarItemProps) => {
  return (
    <li>
      <Link href={href}>
        <a className={cn("sidebar-item", active && "active")}>
          <i className={`${icon} w-5`}></i>
          <span>{children}</span>
        </a>
      </Link>
    </li>
  );
};

const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="sidebar-header">{children}</div>;
};

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "sidebar",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
              <i className="fas fa-route"></i>
            </div>
            <h1 className="text-lg font-bold">Vision One</h1>
          </div>
          <button className="lg:hidden text-sidebar-foreground" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            <SidebarItem href="/" icon="fas fa-tachometer-alt" active={location === "/"}>
              Dashboard
            </SidebarItem>
            
            <li>
              <SidebarHeader>Tracking & Monitoring</SidebarHeader>
            </li>
            <SidebarItem href="/vehicle-tracking" icon="fas fa-route" active={location === "/vehicle-tracking"}>
              Vehicle Tracking
            </SidebarItem>
            <SidebarItem href="/manifest-system" icon="fas fa-qrcode" active={location === "/manifest-system"}>
              Manifest System
            </SidebarItem>
            <SidebarItem href="/traffic-monitoring" icon="fas fa-traffic-light" active={location === "/traffic-monitoring"}>
              Traffic Monitoring
            </SidebarItem>
            
            <li>
              <SidebarHeader>Management</SidebarHeader>
            </li>
            <SidebarItem href="/parks-terminals" icon="fas fa-building" active={location === "/parks-terminals"}>
              Parks & Terminals
            </SidebarItem>
            <SidebarItem href="/passenger-management" icon="fas fa-users" active={location === "/passenger-management"}>
              Passengers
            </SidebarItem>
            <SidebarItem href="/logistics-parcels" icon="fas fa-truck" active={location === "/logistics-parcels"}>
              Logistics & Parcels
            </SidebarItem>
            
            <li>
              <SidebarHeader>Administration</SidebarHeader>
            </li>
            <SidebarItem href="/security-integration" icon="fas fa-shield-alt" active={location === "/security-integration"}>
              Security Integration
            </SidebarItem>
            <SidebarItem href="/violations" icon="fas fa-exclamation-triangle" active={location === "/violations"}>
              Violations
            </SidebarItem>
            <SidebarItem href="/reports-analytics" icon="fas fa-chart-bar" active={location === "/reports-analytics"}>
              Reports & Analytics
            </SidebarItem>
            <SidebarItem href="/settings" icon="fas fa-cog" active={location === "/settings"}>
              Settings
            </SidebarItem>
          </ul>
        </nav>
      </aside>
    </>
  );
}
