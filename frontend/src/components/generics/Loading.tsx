export default function Loading() {
    return (
      <div className="flex-center h-screen w-screen flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <h1 className="flexible-text text-primary">Loading...</h1>
      </div>
    );
  }