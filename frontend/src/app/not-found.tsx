// nextjs component
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container p-4">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight mb-4 first:mt-0">
        Not Found
      </h2>
      <p className="mb-4">Could not find requested resource</p>
      <Link className="underline" href="/">
        Return Home
      </Link>
    </div>
  );
}
