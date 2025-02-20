import type { TimeRangeSelectorTypes } from "../types";


// Time range filter component for metrics data
// Allows switching between hour/day/week views
export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorTypes) {
    return (
      <div className="flex gap-2">
        {["hour", "day", "week"].map((range) => (
          <button
            key={range}
            onClick={() => onChange(range as "hour" | "day" | "week")}
            className={`px-4 py-2 rounded flexible-text text-white ${
              value === range
                ? "bg-secondary "
                : "bg-primary hover:bg-gray-600"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
    );
  }