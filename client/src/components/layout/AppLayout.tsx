import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
