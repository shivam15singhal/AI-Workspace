import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import axios from "axios";

import { register } from "@/services/auth/authService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login", {
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.detail ??
            "Unable to create account."
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
            Create Account
          </CardTitle>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your AI Workspace account to get started
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleRegister}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name
            </Label>

            <Input
              id="name"
              autoFocus
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              disabled={loading}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
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
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={password}
              disabled={loading}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              disabled={loading}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
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
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}