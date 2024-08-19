"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { cn } from "@/app/lib/utils";
import { Icons } from "@/app/components/icons";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import ConnectButton from "./connect_wallet";
import Connect from "./Connect";
import axiosInstance from "@/app/utils/apis";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    authType: "USER_SIGNUP",
    stellarAccountId: "",
    email: "user@gmail.com",
    name: "John Doe",
    avatar: "x",
    x: "x",
    y: "y",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleKeyChange = (key: string) => {
    setFormData((prevState) => ({
      ...prevState,
      stellarAccountId: key,
    }));
  };

  async function signup(data: any) {
    try {
      const response = await axiosInstance.post(`/auth/user/signup`, data);
      console.log("Signup response:", response);

      const test = localStorage.setItem("token", response.data.access_token);
      console.log("user_token", test);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form data:", formData);

      const response = await signup(formData);
      console.log("Signup successful:", response);
      router.push("/user-dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle signup error, e.g., show an error message
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your Name"
              type="text"
              required
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              required
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="avatar">
              Avatar
            </Label>
            <Input
              id="avatar"
              placeholder="Enter link to Avatar"
              type="text"
              required
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.avatar}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <div className="grid gap-4">
              <Label className="mb-2 text-black" htmlFor="wallet">
                Wallet Address
              </Label>
            </div>
            <div>
              <Connect formData={formData} handleKeyChange={handleKeyChange} />
            </div>
          </div>
          <a
            href="/user-signin"
            className="text-sm text-muted-foreground hover:text-sky-600"
          >
            Sign in instead?
          </a>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
