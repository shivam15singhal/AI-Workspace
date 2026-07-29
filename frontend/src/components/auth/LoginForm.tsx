import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/auth/authService";
import { useAuthStore } from "@/store/authStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      setToken(response.access_token);

      await refreshUser();

      navigate("/");
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.detail ||
            "Invalid email or password."
        );
      } else {
        setErrorMessage(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-3xl border border-border/60 bg-card shadow-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>

        <div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to AI Workspace
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              disabled={loading}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="h-11 rounded-xl"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}