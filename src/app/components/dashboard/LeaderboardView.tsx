import { useState, useEffect } from "react";

interface DeveloperStats {
  id: string;
  name: string;
  email: string;
  tasksCompleted: number;
  averageScore: number;
  totalEarned: number;
  skillLevel: string;
  recentEvaluations: {
    speed: number;
    accuracy: number;
    communication: number;
    problem_solving: number;
    code_quality: number;
    independence: number;
    alignment: number;
    efficiency: number;
    initiative: number;
    collaboration: number;
  }[];
}

export const LeaderboardView = () => {
  const [developers, setDevelopers] = useState<DeveloperStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof DeveloperStats>("averageScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/developers/stats");
        if (!response.ok) throw new Error("Failed to fetch developer stats");
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error("Error fetching developer stats:", error);
        setError("Failed to load developer statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const handleSort = (field: keyof DeveloperStats) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const sortedDevelopers = [...developers].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return sortOrder === "asc"
      ? (aValue as any) - (bValue as any)
      : (bValue as any) - (aValue as any);
  });

  if (loading) {
    return (
      <div className="text-center p-8">Loading developer statistics...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Developer Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">Rank</th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Developer
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("tasksCompleted")}
              >
                Tasks Completed
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("averageScore")}
              >
                Avg. Score
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("totalEarned")}
              >
                Total Earned
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("skillLevel")}
              >
                Skill Level
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDevelopers.map((dev, index) => (
              <tr
                key={dev.id}
                className="border-b border-gray-700 hover:bg-gray-700/50"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{dev.name}</div>
                    <div className="text-sm text-gray-400">{dev.email}</div>
                  </div>
                </td>
                <td className="p-3">{dev.tasksCompleted}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {dev.averageScore.toFixed(2)}
                    </span>
                    <div className="ml-2 w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(dev.averageScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3">${dev.totalEarned.toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      dev.skillLevel === "Expert"
                        ? "bg-purple-500/20 text-purple-300"
                        : dev.skillLevel === "Advanced"
                        ? "bg-blue-500/20 text-blue-300"
                        : dev.skillLevel === "Intermediate"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {dev.skillLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Metrics Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Skill Levels</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
              <span>Expert (4.5+ avg)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span>Advanced (4.0+ avg)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span>Intermediate (3.5+ avg)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2" />
              <span>Beginner (&lt;3.5 avg)</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Evaluation Criteria</h3>
          <div className="space-y-1 text-sm">
            <div>• Code Quality</div>
            <div>• Problem Solving</div>
            <div>• Communication</div>
            <div>• Task Completion</div>
          </div>
        </div>

        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Ranking Factors</h3>
          <div className="space-y-1 text-sm">
            <div>• Average Score</div>
            <div>• Tasks Completed</div>
            <div>• Task Complexity</div>
            <div>• Consistency</div>
          </div>
        </div>

        <div className="bg-gray-700/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Progression</h3>
          <div className="space-y-1 text-sm">
            <div>• Regular Evaluations</div>
            <div>• Skill Development</div>
            <div>• Task Difficulty</div>
            <div>• Performance Trends</div>
          </div>
        </div>
      </div>
    </div>
  );
};
