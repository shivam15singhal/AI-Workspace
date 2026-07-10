import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
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
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <Button className="w-full">
          Login
        </Button>

      </CardContent>
    </Card>
  );
}