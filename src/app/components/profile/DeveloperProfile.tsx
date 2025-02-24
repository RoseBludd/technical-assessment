"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Developer } from "@/types/developer";

interface DeveloperProfileProps {
  isEditing?: boolean;
  developerId?: string;
}

export const DeveloperProfile = ({
  isEditing = false,
  developerId,
}: DeveloperProfileProps) => {
  const { data: session } = useSession();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(isEditing);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    paypal_email: "",
    phone: "",
    github_url: "",
    portfolio_url: "",
    resume_url: "",
    years_experience: 0,
    skills: [] as string[],
    preferred_technologies: [] as string[],
    hourly_rate: 0,
    availability_hours: 0,
    timezone: "",
    english_proficiency: "",
    education: "",
  });

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const id = developerId || session?.user?.id;
        if (!id) return;

        const response = await fetch(`/api/developers/${id}`);
        if (!response.ok) throw new Error("Failed to fetch developer data");

        const data = await response.json();
        setDeveloper(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          paypal_email: data.paypal_email || "",
          phone: data.phone || "",
          github_url: data.github_url || "",
          portfolio_url: data.portfolio_url || "",
          resume_url: data.resume_url || "",
          years_experience: data.years_experience || 0,
          skills: data.skills || [],
          preferred_technologies: data.preferred_technologies || [],
          hourly_rate: data.hourly_rate || 0,
          availability_hours: data.availability_hours || 0,
          timezone: data.timezone || "",
          english_proficiency: data.english_proficiency || "",
          education: data.education || "",
        });
        setPreviewUrl(data.profile_picture_url || "");
      } catch (err) {
        setError("Failed to load developer profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeveloper();
  }, [developerId, session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Handle image upload first if there's a new image
      let profilePictureUrl = developer?.profile_picture_url;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadResponse = await fetch("/api/upload/profile-picture", {
          method: "POST",
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error("Failed to upload image");
        const { url } = await uploadResponse.json();
        profilePictureUrl = url;
      }

      // Update developer profile
      const response = await fetch(`/api/developers/${developer?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profile_picture_url: profilePictureUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setEditMode(false);
      // Refresh developer data
      const updatedData = await response.json();
      setDeveloper(updatedData);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!developer) {
    return <div className="text-gray-500 p-4">Developer not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={previewUrl || "/default-avatar.png"}
              alt={developer.name || "Profile picture"}
              fill
              className="rounded-full object-cover"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </label>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{developer.name}</h1>
            <p className="text-gray-400">{developer.role}</p>
            <p className="text-gray-400">{developer.email}</p>
          </div>
        </div>
        {(session?.user?.id === developer.id ||
          session?.user?.role === "admin") && (
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                PayPal Email
              </label>
              <input
                type="email"
                value={formData.paypal_email}
                onChange={(e) =>
                  setFormData({ ...formData, paypal_email: e.target.value })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.years_experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    years_experience: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Hourly Rate (USD)
              </label>
              <input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourly_rate: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Weekly Availability (hours)
              </label>
              <input
                type="number"
                value={formData.availability_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability_hours: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({ ...formData, timezone: e.target.value })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Skills and Technologies */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Preferred Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.preferred_technologies.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferred_technologies: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  })
                }
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-gray-400 text-sm">Tasks Completed</h3>
              <p className="text-2xl font-bold text-white">
                {developer.tasksCompleted || 0}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-gray-400 text-sm">Active Tasks</h3>
              <p className="text-2xl font-bold text-white">
                {developer.activeTasks || 0}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-gray-400 text-sm">Average Score</h3>
              <p className="text-2xl font-bold text-white">
                {developer.averageScore || 0}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-gray-400 text-sm">Total Earned</h3>
              <p className="text-2xl font-bold text-white">
                ${developer.totalEarned || 0}
              </p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Years of Experience:</span>
                  <span className="text-white ml-2">
                    {developer.years_experience}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Hourly Rate:</span>
                  <span className="text-white ml-2">
                    ${developer.hourly_rate}/hr
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Availability:</span>
                  <span className="text-white ml-2">
                    {developer.availability_hours} hours/week
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Timezone:</span>
                  <span className="text-white ml-2">{developer.timezone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{developer.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">
                    {developer.phone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">GitHub:</span>
                  {developer.github_url ? (
                    <a
                      href={developer.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 ml-2"
                    >
                      View Profile
                    </a>
                  ) : (
                    <span className="text-white ml-2">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Technologies */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Skills & Technologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-400 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {developer.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-gray-400 mb-2">Preferred Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {developer.preferred_technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Task History */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Tasks
            </h3>
            <div className="space-y-4">
              {developer.task_assignments?.map((task) => (
                <div key={task.id} className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{task.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {task.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        task.status === "completed"
                          ? "bg-green-900 text-green-200"
                          : task.status === "in_progress"
                          ? "bg-blue-900 text-blue-200"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    <span>
                      Started: {new Date(task.start_date).toLocaleDateString()}
                    </span>
                    {task.completed_at && (
                      <span className="ml-4">
                        Completed:{" "}
                        {new Date(task.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
