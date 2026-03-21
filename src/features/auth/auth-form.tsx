"use client";

import Link from "@/compat/next-link";
import { useRouter } from "@/compat/next-navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { SurfaceCard } from "@/components/ui/surface-card";
import { authApi } from "@/lib/api/endpoints/auth-api";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await authApi.register({ email, password, inviteCode });
      } else {
        await authApi.login({ email, password });
      }

      router.push("/app");
      router.refresh();
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not complete authentication",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SurfaceCard className="auth-card">
      <div className="auth-copy">
        <span className="eyebrow">{isRegister ? "Create operator access" : "Operator login"}</span>
        <h1>{isRegister ? "Register a studio operator" : "Sign in to manage bookings"}</h1>
        <p>
          These forms call the existing backend auth endpoints directly. Register
          expects the backend invite code because the current API is private.
        </p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {isRegister ? (
          <label className="field">
            <span>Invite code</span>
            <input
              className="input"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              required
            />
          </label>
        ) : null}

        {error ? (
          <NoticeBanner title="Authentication error">
            <p>{error}</p>
          </NoticeBanner>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </Button>

        <p className="muted-copy">
          {isRegister ? "Already have access?" : "Need an invite?"}{" "}
          <Link href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Register here"}
          </Link>
        </p>
      </form>
    </SurfaceCard>
  );
}
