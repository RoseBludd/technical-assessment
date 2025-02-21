import "@/styles/global.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center w-full h-full flex-col gap-3">
      <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        Not Found
      </h3>
      <p className="text-lg ">Could not find requested resource</p>
      <Link
        href="/"
        className="py-3 px-5 bg-primary text-primary-foreground shadow hover:bg-primary/90 mt-10"
      >
        Return Home
      </Link>
    </div>
  );
}
