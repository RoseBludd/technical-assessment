"use client";

import { useState, useEffect } from "react";

interface TaskFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const TaskFilters = ({ onFilterChange }: TaskFiltersProps) => {
  const [department, setDepartment] = useState("");
  const [complexity, setComplexity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    onFilterChange({ department, complexity, category });
  }, [department, complexity, category, onFilterChange]);

  const handleClearFilters = () => {
    setDepartment("");
    setComplexity("");
    setCategory("");
  };

  const selectClasses =
    "bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={selectClasses}
          >
            <option value="">All Departments</option>
            <option value="customer_updates">Customer Updates</option>
            <option value="sales">Sales</option>
            <option value="file_review">File Review</option>
            <option value="property_management">Property Management</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Complexity
          </label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className={selectClasses}
          >
            <option value="">All Complexities</option>
            <option value="low">Low (3 days)</option>
            <option value="medium">Medium (5 days)</option>
            <option value="high">High (10 days)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClasses}
          >
            <option value="">All Categories</option>
            <option value="NEW_FEATURE">New Feature</option>
            <option value="BUG_FIX">Bug Fix</option>
            <option value="INTEGRATION">Integration</option>
            <option value="AUTOMATION">Automation</option>
            <option value="OPTIMIZATION">Optimization</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
