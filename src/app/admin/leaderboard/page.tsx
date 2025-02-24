"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Developer } from "@/types/developer";

export default function LeaderboardPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState<keyof Developer>("average_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/developers/stats");
        if (!response.ok) throw new Error("Failed to fetch developers");
        const data = await response.json();
        setDevelopers(data);
      } catch (err) {
        setError("Failed to load developer statistics");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const handleSort = (field: keyof Developer) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }

    setDevelopers(
      [...developers].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        const modifier = sortOrder === "asc" ? 1 : -1;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * modifier;
        }
        return String(aValue).localeCompare(String(bValue)) * modifier;
      })
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">
              Developer Leaderboard
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              A list of all developers with their performance metrics and
              rankings.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-400 truncate">
                Total Developers
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-white">
                {developers.length}
              </dd>
            </div>
          </div>
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-400 truncate">
                Active Tasks
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-white">
                {developers.reduce(
                  (sum, dev) => sum + (dev.active_tasks || 0),
                  0
                )}
              </dd>
            </div>
          </div>
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-400 truncate">
                Completed Tasks
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-white">
                {developers.reduce(
                  (sum, dev) => sum + (dev.completed_tasks || 0),
                  0
                )}
              </dd>
            </div>
          </div>
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-400 truncate">
                Total Earnings
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-white">
                $
                {developers.reduce(
                  (sum, dev) => sum + (dev.total_earned || 0),
                  0
                )}
              </dd>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                      >
                        Developer
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                        onClick={() => handleSort("completed_tasks")}
                      >
                        Tasks Completed
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                        onClick={() => handleSort("active_tasks")}
                      >
                        Active Tasks
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                        onClick={() => handleSort("average_score")}
                      >
                        Average Score
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                        onClick={() => handleSort("total_earned")}
                      >
                        Total Earned
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Skill Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {developers.map((developer) => (
                      <tr key={developer.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <Link
                            href={`/admin/developers/${developer.id}`}
                            className="flex items-center"
                          >
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={
                                  developer.profile_picture_url ||
                                  "/default-avatar.png"
                                }
                                alt=""
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-white">
                                {developer.name}
                              </div>
                              <div className="text-gray-400">
                                {developer.email}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {developer.completed_tasks || 0}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {developer.active_tasks || 0}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {developer.average_score?.toFixed(1) || "0.0"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          ${developer.total_earned || 0}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              developer.skill_level === "Expert"
                                ? "bg-purple-100 text-purple-800"
                                : developer.skill_level === "Advanced"
                                ? "bg-green-100 text-green-800"
                                : developer.skill_level === "Intermediate"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {developer.skill_level || "Beginner"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-white">Skill Levels</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-purple-100 text-purple-800">
                    Expert
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    Score ≥ 4.5, completed 5+ tasks
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-green-100 text-green-800">
                    Advanced
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    Score ≥ 4.0, completed 3+ tasks
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-blue-100 text-blue-800">
                    Intermediate
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    Score ≥ 3.5, completed 1+ tasks
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex rounded-full px-2 text-xs font-semibold bg-gray-100 text-gray-800">
                    Beginner
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    New developers or lower scores
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-white">
                Scoring Factors
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300">
                    Task Priority (50%)
                  </h4>
                  <p className="mt-1 text-sm text-gray-400">
                    High: 5 points, Medium: 3 points, Low: 1 point
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300">
                    Timeliness (50%)
                  </h4>
                  <p className="mt-1 text-sm text-gray-400">
                    On time: 5 points, 1 day late: 4 points, 2 days: 3 points,
                    etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
