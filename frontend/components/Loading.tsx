'use client';

import React from 'react';

interface LoadingProps {
  className?: string;
  message?: string;
}

export default function Loading({ className = '', message = 'Loading...' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t-4 border-primary animate-[spin_1s_ease-in-out_infinite]" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Skeleton loaders
export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card animate-pulse h-[500px]">
      <div className="space-y-4 p-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-[400px] bg-muted rounded"></div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4 p-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LoadingBarProps {
  progress?: number;
}

export function LoadingBar({ progress }: LoadingBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 z-50 overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ 
          width: `${progress ?? 100}%`,
          animation: progress ? undefined : 'indeterminate 1.5s infinite ease-in-out'
        }}
      />
    </div>
  );
}

// Add keyframes for the indeterminate animation
const styles = `
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
` as string;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
      ))}
    </div>
  );
}
