"use client";

import { React, useState } from "react";

import { cn } from "@/app/lib/utils";
import { Icons } from "@/app/components/icons";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { SignInRequest, SignInResponse } from "@/app/utils/authapi";
import Link from "next/navigation";
import axios from "axios";
import axiosInstance from "@/app/utils/apis";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [formData, setFormData] = useState<SignInRequest>({
    authType: "ORG_SIGNIN",
    email: "",
    password: "",
    x: "random",
    y: "random",
  });

  const router = useRouter();

  const API_URL = "https://auto-stellar-backend.onrender.com/";

  const signup = async (data: SignInRequest) => {
    try {
      const response = await axiosInstance.post(`/auth/org/signin`, data);
      console.log("Signup response:", response.data);
      const test = localStorage.setItem("token", response.data.access_token);
      console.log("org_token", test);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log("Signup successful:", response);
      router.push("/organization-dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Enter your Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <a
            href="/organization-signup  "
            className="text-sm text-muted-foreground hover:text-sky-600"
          >
            Sign up instead?
          </a>
          <Button className="w-full">Sign In</Button>
        </div>
      </form>
    </div>
  );
}
