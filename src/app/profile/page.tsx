"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Developer } from "@/types/developer";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    github_url: "",
    portfolio_url: "",
    skills: [] as string[],
    preferred_technologies: [] as string[],
    timezone: "",
    english_proficiency: "",
    education: "",
    hourly_rate: 0,
    availability_hours: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/developers/${session?.user?.id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setDeveloper(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          github_url: data.github_url || "",
          portfolio_url: data.portfolio_url || "",
          skills: data.skills || [],
          preferred_technologies: data.preferred_technologies || [],
          timezone: data.timezone || "",
          english_proficiency: data.english_proficiency || "",
          education: data.education || "",
          hourly_rate: data.hourly_rate || 0,
          availability_hours: data.availability_hours || 0,
        });
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/developers/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedDeveloper = await response.json();
      setDeveloper(updatedDeveloper);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "skills" | "preferred_technologies"
  ) => {
    const values = e.target.value.split(",").map((v) => v.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow-sm rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Developer Profile
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  Manage your developer profile and preferences
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github_url"
                    className="block text-sm font-medium text-gray-200"
                  >
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    id="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="portfolio_url"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    id="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    id="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-200"
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => handleArrayInputChange(e, "skills")}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="preferred_technologies"
                  className="block text-sm font-medium text-gray-200"
                >
                  Preferred Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  name="preferred_technologies"
                  id="preferred_technologies"
                  value={formData.preferred_technologies.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange(e, "preferred_technologies")
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="hourly_rate"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="hourly_rate"
                    id="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availability_hours"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Weekly Availability (hours)
                  </label>
                  <input
                    type="number"
                    name="availability_hours"
                    id="availability_hours"
                    value={formData.availability_hours}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
