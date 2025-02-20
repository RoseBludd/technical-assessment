"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Applicant {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  submittedAt: string;
  score: number | null;
}

export default function ApplicantsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: searchParams.get("status") || "all",
    role: searchParams.get("role") || "all",
  });

  useEffect(() => {
    fetchApplicants();
  }, [filter]);

  async function fetchApplicants() {
    try {
      const response = await fetch(
        `/api/admin/applicants?status=${filter.status}&role=${filter.role}`
      );
      const data = await response.json();
      setApplicants(data);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(type: "status" | "role", value: string) {
    const newFilter = { ...filter, [type]: value };
    setFilter(newFilter);
    router.push(
      `/admin/applicants?status=${newFilter.status}&role=${newFilter.role}`
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Applicants</h1>
        <div className="flex gap-4">
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 border-0"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filter.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 border-0"
          >
            <option value="all">All Roles</option>
            <option value="frontend_specialist">Frontend Specialist</option>
            <option value="backend_specialist">Backend Specialist</option>
            <option value="fullstack_developer">Fullstack Developer</option>
            <option value="devops_engineer">DevOps Engineer</option>
            <option value="technical_lead">Technical Lead</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Submitted
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {applicant.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {applicant.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      applicant.role
                    )}`}
                  >
                    {formatRole(applicant.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.status === "passed"
                        ? "bg-green-900 text-green-200"
                        : applicant.status === "failed"
                        ? "bg-red-900 text-red-200"
                        : "bg-yellow-900 text-yellow-200"
                    }`}
                  >
                    {applicant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {applicant.score !== null ? `${applicant.score}%` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(applicant.submittedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/applicants/${applicant.id}`}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "frontend_specialist":
      return "bg-blue-900 text-blue-200";
    case "backend_specialist":
      return "bg-green-900 text-green-200";
    case "fullstack_developer":
      return "bg-purple-900 text-purple-200";
    case "devops_engineer":
      return "bg-orange-900 text-orange-200";
    case "technical_lead":
      return "bg-pink-900 text-pink-200";
    default:
      return "bg-gray-900 text-gray-200";
  }
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
