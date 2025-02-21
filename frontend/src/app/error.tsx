// nextjs component
'use client';

const Error = ({ error, reset }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={reset}>Try again</button>
  </div>
);

export default Error;
