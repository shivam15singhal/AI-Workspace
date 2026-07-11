import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">
          Welcome Back
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

      </CardContent>
    </Card>
  );
}