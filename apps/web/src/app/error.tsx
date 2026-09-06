'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-ink p-6">
      <div className="max-w-md text-center">
        <p className="text-primary-700 text-sm font-medium mb-2">Iriba</p>
        <h1 className="font-serif text-2xl mb-3">Something went wrong</h1>
        <p className="text-ink/55 text-sm leading-relaxed">{error.message || 'The page failed to render.'}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 bg-primary-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
