// Types of the Application, should be a separate file for each 
// type based on the component that uses it
// but for now, we will keep it here as it's a small project


// Main Types of the Application
export type TimeSeriesData = {
    timestamp: string;
    value: number;
  }
  
  export type StatusUpdate = {
    id: string;
    status: "healthy" | "warning" | "error";
    message: string;
    timestamp: string;
  }
  

// Component Types
export type MetricsChartTypes = {
    data: TimeSeriesData[];
  };

export type ErrorBoundaryTypes = {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  };

export type TimeRange = "hour" | "day" | "week";


export type StatusListTypes = {
    updates: StatusUpdate[];
  }

export type TimeRangeSelectorTypes = {
    value: "hour" | "day" | "week";
    onChange: (value: "hour" | "day" | "week") => void;
  }
  