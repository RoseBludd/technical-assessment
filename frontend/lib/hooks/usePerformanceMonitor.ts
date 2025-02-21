import { useEffect } from 'react';
import { onCLS, onFID, onLCP } from 'web-vitals';

export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    // Measure component mount time
    const mountTime = performance.now();

    // Use Web Vitals for performance metrics
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);

    // Log render time
    console.log(`${componentName} mounted in ${performance.now() - mountTime}ms`);

    return () => {
      const unmountTime = performance.now();
      console.log(`${componentName} unmounted after ${unmountTime - mountTime}ms`);
    };
  }, [componentName]);
};

// Error tracking utility
export const trackError = (error: Error, componentName: string) => {
  // In a real app, this would send to an error tracking service like Sentry
  console.error(`Error in ${componentName}:`, error);
};
