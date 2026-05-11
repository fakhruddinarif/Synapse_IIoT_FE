import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@shared/validators";
import { Button, Checkbox, TextInput } from "@ui/components";
import { useAuthStore } from "@app/store/useAuthStore";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await login({ email: data.email, password: data.password });
    } catch {
      setError("Invalid credentials or server unavailable.");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Sign in</h2>
        <p className="text-sm text-secondary">
          Access the Synapse IIoT control plane.
        </p>
      </div>
      {error && <div className="text-xs text-status-alarm">{error}</div>}
      <form className="space-y-4" onSubmit={onSubmit}>
        <TextInput
          label="Email"
          placeholder="operator@synapse.local"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Checkbox label="Remember this terminal" {...register("remember")} />
        <Button type="submit" fullWidth loading={isLoading}>
          Authenticate
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
