import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Oops! Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try again
              or contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
