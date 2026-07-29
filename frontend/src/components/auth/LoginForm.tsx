import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/auth/authService";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
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

  async function handleLogin() {
    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      setToken(response.access_token);
      await refreshUser();

      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
      console.error(error);
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

    <CardContent className="space-y-6">
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
        className="h-11 w-full rounded-xl text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="font-medium text-primary transition-colors hover:underline"
  >
    Create one
  </Link>
</p>
    </CardContent>
  </Card>
);
}