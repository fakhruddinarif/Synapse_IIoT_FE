import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../providers/AppProvider";
import {
  Badge,
  Button,
  Field,
  Panel,
  Select,
  TextInput,
} from "../components/Ui";
import {
  AlertIcon,
  CheckIcon,
  ShieldIcon,
  SparkIcon,
  UserIcon,
} from "../components/Icons";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, user, isAuthenticated } = useAppContext();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("SecurePass123!");
  const [role, setRole] = useState("ADMIN");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionLabel = mode === "login" ? "Login" : "Create account";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (mode === "login") {
        await login({ email, password });
        setMessage("Login success. Cookie sudah di-set oleh backend.");
      } else {
        await register({ username, email, password, role });
        setMessage("User registered and session ready.");
      }

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] px-4 py-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_25%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 px-2 lg:px-6">
          <Badge tone="accent">
            <SparkIcon className="h-3.5 w-3.5" />
            Modern IIoT frontend
          </Badge>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              Synapse authentication
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {isAuthenticated
                ? `Hello, ${user?.username}.`
                : "Sign in to the control room."}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Backend menggunakan cookie `JWT-TOKEN`, jadi frontend cukup
              memanggil endpoint login/register dengan credentials include.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Secure session</p>
              <p className="mt-2 text-sm text-slate-300">
                Token disimpan di HTTP-only cookie oleh backend.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Responsive UI</p>
              <p className="mt-2 text-sm text-slate-300">
                Layout bekerja untuk mobile, tablet, dan desktop.
              </p>
            </div>
          </div>
        </div>

        <Panel className="mx-auto w-full max-w-xl">
          <div className="grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Access panel
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {mode === "login" ? "Login" : "Register"}
                </h2>
              </div>
              <UserIcon className="h-10 w-10 text-cyan-200" />
            </div>

            <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-cyan-400/15 text-cyan-50" : "text-slate-300"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-cyan-400/15 text-cyan-50" : "text-slate-300"}`}
              >
                Register
              </button>
            </div>

            {mode === "register" ? (
              <Field label="Username">
                <TextInput
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Field>
            ) : null}
            <Field label="Email">
              <TextInput
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            {mode === "register" ? (
              <Field label="Role">
                <Select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                  <option value="VIEWER">VIEWER</option>
                </Select>
              </Field>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
              >
                <ShieldIcon className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : actionLabel}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Skip
              </Button>
            </div>

            {message ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2">
                  {message.toLowerCase().includes("success") ? (
                    <CheckIcon className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <AlertIcon className="h-4 w-4 text-amber-300" />
                  )}
                  {message}
                </span>
              </div>
            ) : null}

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50/90">
              {mode === "login"
                ? "Gunakan admin account untuk memulai sesi dan membuka data endpoint yang butuh cookie."
                : "Registrasi tersedia untuk membuat user baru langsung dari frontend."}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AuthPage;
