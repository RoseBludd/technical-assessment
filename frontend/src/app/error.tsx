// nextjs component - automatically creates an <ErrorBoundary /> component in app router
'use client';

const Error = ({ error, reset }) => (
  <div className="container p-4">
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight mb-4 first:mt-0">
      Error
    </h2>
    <p className="mb-4">{error.message}</p>
    <button onClick={reset}>Try again</button>
  </div>
);

export default Error;
