"use client";

import { useState } from "react";
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

export default function NewApplicationForm() {
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Application submission failed");
      }

      setSubmitStatus({
        type: "success",
        message:
          "Application submitted successfully! Redirecting to assessment...",
      });

      // Clear form
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

      // Redirect to test page after successful submission
      if (data.data?.testUrl) {
        window.location.href = data.data.testUrl;
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-200 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitStatus && (
        <div
          className={`p-4 rounded-md ${
            submitStatus.type === "success"
              ? "bg-green-900 border-green-700 text-green-100"
              : "bg-red-900 border-red-700 text-red-100"
          } border`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClasses}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="lastName" className={labelClasses}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className={labelClasses}>
          WhatsApp Number
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          required
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="+1234567890"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="position" className={labelClasses}>
          Position
        </label>
        <select
          id="position"
          name="position"
          required
          value={formData.position}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select a position</option>
          <option value="frontend_specialist">Frontend Specialist</option>
          <option value="backend_specialist">Backend Specialist</option>
          <option value="integration_specialist">Integration Specialist</option>
          <option value="devops_engineer">DevOps Engineer</option>
          <option value="fullstack_developer">Fullstack Developer</option>
          <option value="technical_lead">Technical Lead</option>
        </select>
      </div>

      <div>
        <label htmlFor="experience" className={labelClasses}>
          Years of Experience
        </label>
        <select
          id="experience"
          name="experience"
          required
          value={formData.experience}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select experience level</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      <div>
        <label htmlFor="portfolioUrl" className={labelClasses}>
          Portfolio URL
        </label>
        <input
          type="url"
          id="portfolioUrl"
          name="portfolioUrl"
          value={formData.portfolioUrl}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="skills" className={labelClasses}>
          Skills
        </label>
        <textarea
          id="skills"
          name="skills"
          required
          value={formData.skills}
          onChange={handleChange}
          rows={3}
          placeholder="Enter your skills (comma-separated)"
          className={inputClasses}
        />
        <p className="mt-1 text-sm text-gray-400">
          Separate skills with commas (e.g., JavaScript, React, Node.js)
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
