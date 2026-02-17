import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/contexts/auth.context";
import { RegisterRequestSchema } from "~/services/auth.service";
import { z } from "zod";

export function loader() {
  return null;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate form data with Zod
      const validatedData = RegisterRequestSchema.parse(formData);

      await register(validatedData);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => (globalThis.location.href = "/login")}
            >
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            {/* <Button variant="outline" className="w-full" disabled={isSubmitting}>
              Sign up with Google
            </Button> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
