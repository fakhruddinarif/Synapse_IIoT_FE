import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Under Maintenance
            </h1>
            <p className="text-gray-600 mb-6">
              We're currently performing scheduled maintenance to improve your
              experience. We'll be back online shortly. Thank you for your
              patience!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Estimated downtime:</strong> 30-60 minutes
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <strong>Started at:</strong> {new Date().toLocaleString()}
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="default">
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
