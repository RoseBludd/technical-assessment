# Frontend Assessment: Dashboard

A modern, responsive dashboard built with Next.js 14 for real-time system metrics visualization and status monitoring.

## Key Features

- Interactive metrics visualization with filtering
- Status monitoring with visual indicators
- Searchable and filterable data
- Responsive design and optimized loading states
- Light/dark mode feature

## Component Architecture

### Main Components

1. **Dashboard Page**

   - Central container managing global state and error handling
   - Coordinates component loading states

2. **MetricsChart**

   - Time-series visualization with Recharts
   - Time range selection (hour/day/week)
   - Trend indicators

3. **DataGrid (Table)**

   - Filterable status updates table
   - Search functionality
   - Scrollable content

4. **StatusCards**
   - Status summary with visual indicators
   - Color-coded status display

### Supporting Components

- Loading skeletons for consistent layout
- Custom useMetrics hook for data management

## Tech Stack

### Core

- Next.js 14 with TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- Recharts for data visualization

### Development

- ESLint & Prettier with Tailwind plugin
- React Testing Library + Jest
- TypeScript for type safety
