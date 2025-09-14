"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import {BackgroundBeamsWithCollision} from "@/components/ui/background-beams-with-collision";
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  if (!isLoaded) return null;

  // Step 1: Collect email + password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else if (result.status === "needs_first_factor") {
        // If using email code / 2FA
        setPendingVerification(true);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle verification if needed (OTP / email code)
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
      } else {
        setError("Verification failed");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
    <div className="min-h-screen flex items-center justify-center from-neutral-950 to-neutral-800 px-4">
    <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 text-neutral-200  p-4 shadow-input bg-black md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-200">
        Login to SnapShrink
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-300">
        Login to SnapShrink
        <br /> If you don&apos;t have an account,{" "}
        <Link href="/sign-up" className="text-orange-500 hover:underline">
          register
        </Link>{" "}
        with SnapShrink
      </p>

      {error && (
        <p className="mt-8 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {!pendingVerification ? (
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              className="text-white"
              id="email"
              name="email"
              placeholder="projectmayhem@fc.com"
              type="email"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                className="text-white pr-16"
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-orange-500 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </LabelInputContainer>
        <div id="clerk-captcha"></div>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isLoading}
          >
            Log in &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent " />

          <div className="flex flex-col space-y-4">
            <button
              onClick={() =>
                signIn.authenticateWithRedirect({
                  strategy: "oauth_google",
                  redirectUrl: "/sso-callback",
                  redirectUrlComplete: "/home",
                })
              }
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md  px-4 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGoogle className="h-4 w-4 t text-neutral-300" />
              <span className="text-sm text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
            <button
              onClick={() =>
                signIn.authenticateWithRedirect({
                  strategy: "oauth_github",
                  redirectUrl: "/sso-callback",
                  redirectUrlComplete: "/home",
                })
              }
                           className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md  px-4 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-300" />
              <span className="text-sm text-neutral-300">
                GitHub
              </span>
              <BottomGradient />
            </button>
          </div>

        </form>
       
        
      ) : (
        <form className="my-8" onSubmit={handleVerify}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              className="text-white"
              id="code"
              name="code"
              placeholder="123456"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white"
            type="submit"
            disabled={isLoading}
          >
            Verify &rarr;
            <BottomGradient />
          </button>
        </form>
      )}
    </div>
     </div>
     </BackgroundBeamsWithCollision>
  );
}
