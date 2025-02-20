import NewApplicationForm from "../components/NewApplicationForm";

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Developer Application
        </h1>
        <p className="text-gray-400 mb-8">
          Join our team of skilled developers. Fill out the form below to start
          your journey.
        </p>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <NewApplicationForm />
        </div>
      </div>
    </div>
  );
}
