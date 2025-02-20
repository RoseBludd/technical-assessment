"use client";

import { useTimeRange } from '../hooks/useTimeRange';
import { useMetricsData } from '../hooks/useMetricData';
import Loading from "./generics/Loading";
import ErrorBoundary from "./ErrorBoundary";
import MetricsChart from "./MetricsChart";
import StatusList from "./StatusList";
import TimeRangeSelector from "./TimeRangeSelector";
import { useEffect, useState, useRef } from "react";
import { sidebarAnimation } from '../animations';
import Sidebar from "./Sidebar";
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../providers/ThemeContext';


export default function MetricsDashboard() {
  const { timeRange, setTimeRange } = useTimeRange();
  const { metrics, status, loading, error } = useMetricsData(timeRange);
  const [isOpen, setIsOpen] = useState(true);
  const { theme } = useTheme();

  // Refs for GSAP animations
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const hamburgerRef = useRef(null);
  
  // Trigger sidebar animation when isOpen state changes
  useEffect(() => {
    if (isOpen) {
      sidebarAnimation.open(sidebarRef, mainContentRef, hamburgerRef);
    } else {
      sidebarAnimation.close(sidebarRef, mainContentRef, hamburgerRef);
    }
  }, [isOpen]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <Sidebar isOpen={isOpen} sidebarRef={sidebarRef} />

      {/* Toggle Button */}
      <button 
        ref={hamburgerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-30 p-2  rounded-lg transition-all ${
          isOpen ? 'left-[184px]' : 'left-4 bg-secondary'
        }`}
      >
        <div className="flexible-text flex items-center justify-center text-white font-bold">
          {isOpen ? '<<' : '>>'}
        </div>
      </button>

      {/* Main Content */}
      <main 
        ref={mainContentRef}
        className={`min-h-screen transition-all duration-500 ${
          isOpen ? 'ml-[240px] w-[calc(100%-240px)]' : 'ml-0 w-full'
        }`}
      >
        <div className="space-y-6 p-4">
          <div className="flex-between flex-wrap gap-2 md:gap-4">
            <h1 className={`text-2xl font-bold h-10 ml-12 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>Metrics Dashboard</h1>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary>
            <div className="bg-primary rounded-lg p-4">
                <h2 className="flexible-header mb-4">Performance Metrics</h2>
                <MetricsChart data={metrics} />
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="bg-primary rounded-lg p-4">
                <h2 className="flexible-header mb-4">System Status</h2>
                <StatusList updates={status} />
              </div>
            </ErrorBoundary>
          </div>

          <div className="flexible-text absolute bottom-0 right-0 w-full bg-primary py-1 md:py-2 text-white text-center">
              Jed Edison Donaire
            </div>
        </div>
      </main>
    </div>
  );
}