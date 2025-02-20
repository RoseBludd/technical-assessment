'use client';

import { Placeholder } from "@/components/placeholder";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <Placeholder label={error.message ?? 'Something went wrong!'} />
    </div>
  );
}