import type { SidebarTypes } from "../types";
  
// Collapsible sidebar component with navigation links
// Uses transform for smooth animations and better performance
  export default function Sidebar({ isOpen, sidebarRef }: SidebarTypes) {
    return (
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[240px] bg-primary z-20 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-4">
          <h2 className="flexible-text text-xl font-semibold">Navigation</h2>
          <nav className="space-y-2 flexible-text">
            <a href="#" className="block p-2 bg-secondary hover:bg-secondary rounded">Dashboard</a>
            <a href="#" className="block p-2 hover:bg-secondary rounded">Analytics</a>
            <a href="#" className="block p-2 hover:bg-secondary rounded">Settings</a>
          </nav>
        </div>
      </div>
    );
  }