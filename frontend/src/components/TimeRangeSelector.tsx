interface TimeRangeSelectorProps {
    value: "hour" | "day" | "week";
    onChange: (value: "hour" | "day" | "week") => void;
  }
  
  export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
    return (
      <div className="flex gap-2">
        {["hour", "day", "week"].map((range) => (
          <button
            key={range}
            onClick={() => onChange(range as "hour" | "day" | "week")}
            className={`px-4 py-2 rounded ${
              value === range
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
    );
  }