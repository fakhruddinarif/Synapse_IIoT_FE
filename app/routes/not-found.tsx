import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <i className="ri-error-warning-line text-5xl"></i>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          <Button asChild className="w-full">
            <Link to="/">
              <i className="ri-home-line mr-2"></i>
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
