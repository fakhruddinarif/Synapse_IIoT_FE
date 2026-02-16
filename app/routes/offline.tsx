import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      window.location.reload();
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              You're Offline
            </h1>
            <p className="text-gray-600 mb-6">
              Please check your internet connection and try again. We'll
              automatically reconnect when your connection is restored.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>No Connection</span>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} variant="default">
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
