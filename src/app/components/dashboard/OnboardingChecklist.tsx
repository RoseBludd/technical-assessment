import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const OnboardingChecklist = () => {
  const [showChecklist, setShowChecklist] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "github",
      title: "Connect GitHub Account",
      description:
        "Link your GitHub account to track your development progress",
      completed: false,
    },
    {
      id: "profile",
      title: "Complete Developer Profile",
      description: "Add your skills, experience, and preferred technologies",
      completed: false,
    },
    {
      id: "first-task",
      title: "Accept First Task",
      description: "Choose a task from the task pool to begin your journey",
      completed: false,
    },
    {
      id: "submit-work",
      title: "Submit Your Work",
      description: "Complete and submit your first task for review",
      completed: false,
    },
  ]);

  // Load checklist state from localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem("onboardingChecklist");
    const savedShow = localStorage.getItem("showOnboardingChecklist");

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }

    if (savedShow) {
      setShowChecklist(JSON.parse(savedShow));
    }
  }, []);

  // Save checklist state to localStorage
  const updateChecklist = (itemId: string, completed: boolean) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    );
    setChecklist(updatedChecklist);
    localStorage.setItem(
      "onboardingChecklist",
      JSON.stringify(updatedChecklist)
    );
  };

  const hideChecklist = () => {
    setShowChecklist(false);
    localStorage.setItem("showOnboardingChecklist", "false");
  };

  if (!showChecklist) return null;

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">
            Getting Started
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Complete these steps to get started with the Developer Portal
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {completedCount}/{checklist.length} completed
          </span>
          <button
            onClick={hideChecklist}
            className="text-gray-400 hover:text-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => updateChecklist(item.id, e.target.checked)}
              className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <h3 className="text-gray-200 font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
