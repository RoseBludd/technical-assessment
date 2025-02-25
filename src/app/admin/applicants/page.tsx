"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  IconSearch,
  IconCalendar,
  IconNotes,
  IconBrandWhatsapp,
  IconBrandGithub,
} from "@tabler/icons-react";

interface Applicant {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  submittedAt: string;
  score: number | null;
  meetingNotes?: string;
  interestLevel?: string;
  lastMeetingDate?: string;
  nextMeetingDate?: string;
  whatsappNumber?: string;
  github_submission?: {
    url: string;
    status: string;
    submitted_at: string;
    last_updated: string;
    pr_number: number;
    tasks_done: number;
    total_tasks: number;
  } | null;
}

function ApplicantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    status: searchParams?.get("status") || "all",
    role: searchParams?.get("role") || "all",
  });

  useEffect(() => {
    fetchApplicants();
  }, [filter]);

  async function fetchApplicants() {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        ...(filter.status !== "all" && { status: filter.status }),
        ...(filter.role !== "all" && { role: filter.role }),
        ...(searchTerm && { search: searchTerm }),
      }).toString();

      const response = await fetch(
        `/api/admin/applications${queryParams ? `?${queryParams}` : ""}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid response format");
      }

      const formattedApplicants = result.data.map((app: any) => ({
        id: app.id,
        name: app.name,
        email: app.email,
        role: app.role,
        status: app.status,
        submittedAt: app.submittedAt,
        score: app.score,
        meetingNotes: app.meetingNotes,
        interestLevel: app.interestLevel,
        lastMeetingDate: app.lastMeetingDate,
        nextMeetingDate: app.nextMeetingDate,
        whatsappNumber: app.whatsappNumber,
        github_submission: app.github_submission,
      }));

      setApplicants(formattedApplicants);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch applicants"
      );
      setApplicants([]);
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

  const filteredApplicants = applicants.filter((applicant) => {
    const searchString = searchTerm.toLowerCase();
    return (
      applicant.name.toLowerCase().includes(searchString) ||
      applicant.email.toLowerCase().includes(searchString) ||
      applicant.role.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400">
          Applicants
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-gray-200"
          />
          <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-200"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filter.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-200"
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

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No applicants found
            </div>
          ) : (
            filteredApplicants.map((applicant) => (
              <div key={applicant.id} className="block">
                <div className="p-6 rounded-xl bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/50 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/admin/applicants/${applicant.id}`}
                      className="flex-1"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {applicant.name}
                        </h3>
                        <p className="text-gray-400">{applicant.email}</p>
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      {applicant.whatsappNumber && (
                        <a
                          href={`https://wa.me/${applicant.whatsappNumber.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 ring-1 ring-green-500/30 hover:bg-green-500/30 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconBrandWhatsapp className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          applicant.interestLevel === "interested"
                            ? "bg-green-500/20 text-green-300 ring-1 ring-green-500/30"
                            : applicant.interestLevel === "not_interested"
                            ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                            : "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30"
                        }`}
                      >
                        {applicant.interestLevel
                          ? applicant.interestLevel.replace("_", " ")
                          : "Undecided"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
                        {applicant.role.replace(/_/g, " ")}
                      </span>
                    </div>
                    {applicant.github_submission && (
                      <a
                        href={applicant.github_submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                          applicant.github_submission.status === "completed"
                            ? "bg-green-500/20 text-green-300 ring-1 ring-green-500/30"
                            : applicant.github_submission.status === "failed"
                            ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                            : "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconBrandGithub className="w-4 h-4" />
                        <span>PR #{applicant.github_submission.pr_number}</span>
                        <span className="ml-1">
                          ({applicant.github_submission.tasks_done}/
                          {applicant.github_submission.total_tasks})
                        </span>
                      </a>
                    )}
                    {applicant.lastMeetingDate && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <IconCalendar className="w-4 h-4" />
                        <span>
                          Last Meeting:{" "}
                          {new Date(
                            applicant.lastMeetingDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {applicant.nextMeetingDate && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <IconCalendar className="w-4 h-4" />
                        <span>
                          Next Meeting:{" "}
                          {new Date(
                            applicant.nextMeetingDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {applicant.meetingNotes && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <IconNotes className="w-4 h-4" />
                        <span>Has Notes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicantsList() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <ApplicantsContent />
    </Suspense>
  );
}
