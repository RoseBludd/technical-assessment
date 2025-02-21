'use client';

import React from 'react';

export default function DashboardFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Metrics Dashboard
            </p>
            <div className="hidden sm:block h-4 w-px bg-border"></div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Last updated: {new Date().toLocaleString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:text-primary/80 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
              aria-label="Refresh dashboard"
            >
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}