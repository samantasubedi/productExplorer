import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorState({
  message,
  onRetry,
  title = "Something went wrong",
}: {
  message: string;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <div className="flex justify-center p-6" role="alert">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
