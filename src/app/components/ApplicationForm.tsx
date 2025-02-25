"use client";

import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  portfolioUrl: string;
  position: string;
  experience: string;
  skills: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    applicationId: string;
  };
  error?: string;
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
    portfolioUrl: "",
    position: "",
    experience: "",
    skills: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Application submission failed");
      }

      setSubmitStatus({
        type: "success",
        message: `Application submitted successfully! Application ID: ${data.data?.applicationId}`,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        whatsapp: "",
        portfolioUrl: "",
        position: "",
        experience: "",
        skills: "",
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {submitStatus && (
        <div
          className={`mb-4 p-4 rounded-md ${
            submitStatus.type === "success"
              ? "bg-green-900 text-green-200 border border-green-700"
              : "bg-red-900 text-red-200 border border-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-200">
            Position
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select position</option>
            <option value="frontend_specialist">Frontend Specialist</option>
            <option value="backend_specialist">Backend Specialist</option>
            <option value="integration_specialist">Integration Specialist</option>
            <option value="devops_engineer">DevOps Engineer</option>
            <option value="fullstack_developer">Fullstack Developer</option>
            <option value="technical_lead">Technical Lead</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-200">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp"
            id="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+1234567890"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-200">
            Portfolio URL
          </label>
          <input
            type="url"
            name="portfolioUrl"
            id="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-200">
            Years of Experience
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-200">
            Skills
          </label>
          <textarea
            id="skills"
            name="skills"
            rows={3}
            value={formData.skills}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List your key technical skills (comma-separated)..."
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 focus:ring-offset-gray-900"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
