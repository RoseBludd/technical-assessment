"use client";

import { DeveloperProfile } from "@/app/components/profile/DeveloperProfile";
import { useParams } from "next/navigation";

export default function DeveloperProfilePage() {
  const params = useParams();
  const developerId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DeveloperProfile developerId={developerId} />
      </div>
    </div>
  );
}
