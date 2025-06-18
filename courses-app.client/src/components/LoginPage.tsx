import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import type { User } from "@/types";
import { useState } from "react";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginError, setLoginError] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (email && password) {
      try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (response.status === 201) {
          const data = await response.json();
          const role = data.user.role;
          const email = data.user.email;
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("userId", data.user.id);

          onLogin({ email, role });
        } else if (response.status === 422) {
          const errorData = await response.json();
          setLoginError(errorData.message);
        }
      } catch (error) {
        console.error("Login error", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">EduManage</CardTitle>
          <CardDescription>Course Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={() => setLoginError("")}
                required
              />
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
