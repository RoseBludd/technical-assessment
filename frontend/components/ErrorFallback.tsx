export default function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
        <div className="text-center">
            <p className="text-red-500">Something went wrong!</p>
            <button onClick={resetErrorBoundary} className="text-blue-500">Try again</button>
        </div>
    );
}
