import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

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

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);

      await register({
        name,
        email,
        password,
      });

      alert("Account created successfully!");

      navigate("/login");
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Unable to create account.");
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

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>

          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <Button
          onClick={handleRegister}
          disabled={loading}
          className="
            h-11
            w-full
            rounded-xl
            text-base
            font-medium
            transition-all
            duration-200
            hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-primary transition-colors hover:underline"
          >
            Sign In
          </button>
        </p>
      </CardContent>
    </Card>
  );
}