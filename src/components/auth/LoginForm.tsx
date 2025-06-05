"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Mail, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Validation schemas for login and signup
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).refine(
    (email) => email.toLowerCase().endsWith("@mitsgwl.ac.in"),
    { message: "Please use your college Email address." }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email({ message: "Invalid email address." }).refine(
      (email) => email.toLowerCase().endsWith("@mitsgwl.ac.in"),
      { message: "Please use your college Email address." }
    ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, signup } = useMockAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(isNewUser ? signupSchema : loginSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as any,
  });

  async function onSubmit(data: LoginFormValues | SignupFormValues) {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isNewUser) {
      // Signup flow
      const success = signup(data as SignupFormValues);
      if (success) {
        toast({
          title: "Signup Successful",
          description: "You can now log in with your credentials.",
        });
        setIsNewUser(false);
        form.reset();
      } else {
        form.setError("email", { type: "manual", message: "Email already exists." });
        toast({
          title: "Signup Failed",
          description: "Email is already registered.",
          variant: "destructive",
        });
      }
    } else {
      // Login flow
      const success = login((data as LoginFormValues).email, (data as LoginFormValues).password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
      } else {
        form.setError("email", { type: "manual", message: "Invalid email or password." });
        form.setError("password", { type: "manual", message: "Invalid email or password." });
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-xl max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{isNewUser ? "Sign Up" : "Sign In"}</CardTitle>
        <CardDescription>
          {isNewUser
            ? "Create your account with your college email."
            : "Enter your college email to continue."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username field only for new users */}
            {isNewUser && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} placeholder="Your username" className="pl-10" disabled={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="yourid@mitsgwl.ac.in"
                        {...field}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm password only for new users */}
            {isNewUser && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Confirm Password" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Forgot password link only for existing users */}
            {!isNewUser && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => toast({ title: "Forgot Password", description: "Reset link sent!" })}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isNewUser ? "Sign Up" : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isNewUser ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setIsNewUser(false);
                }}
                disabled={isLoading}
                className="text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New user?{" "}
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setIsNewUser(true);
                }}
                disabled={isLoading}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
