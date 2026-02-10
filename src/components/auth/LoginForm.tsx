"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────── validations ─────────────────── */
const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(e => e.toLowerCase().endsWith("@mitsgwl.ac.in"), {
      message: "College email required",
    }),
  password: z.string().min(1),
});

const signupSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, hyphens, apostrophes"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type LoginVals = z.infer<typeof loginSchema>;
type SignupVals = z.infer<typeof signupSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupVals | LoginVals>({
    resolver: zodResolver(isNewUser ? signupSchema : loginSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as any,
  });

  const toggleMode = () => {
    form.reset();
    form.clearErrors();
    setIsNewUser(p => !p);
  };

  const onSubmit = async (vals: SignupVals | LoginVals) => {
    setIsLoading(true);
    try {
      if (isNewUser) {
        const { fullName, email, password } = vals as SignupVals;
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password }),
        });

        if (!res.ok) throw new Error("Signup failed");

        toast({ title: "Account created ✅", description: "Please log in now." });
        toggleMode(); // switch back to login
      } else {
        const { email, password } = vals as LoginVals;
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) throw new Error(res.error);
        toast({ title: "Login successful" });
        router.push("/dashboard");
      }
    } catch (err: any) {
  const message = err?.message ?? "Something went wrong";

  if (message.includes("User already exists")) {
    toast({
      title: "Email already in use",
      description: "Try logging in instead.",
      variant: "destructive",
    });
    return; // don't switch back to login
  }

  toast({
    title: "Auth error",
    description: message,
    variant: "destructive",
  });

  // Automatically switch to sign-up if the user was not found
  if (!isNewUser && message.includes("No user")) setIsNewUser(true);
}
 finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {isNewUser ? "Sign Up" : "Sign In"}
        </CardTitle>
        <CardDescription>
          {isNewUser
            ? "Create an account with your college email."
            : "Log in with your college email."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isNewUser && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} placeholder="Full Name" className="pl-10" disabled={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@mitsgwl.ac.in"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isNewUser ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isNewUser ? (
            <>
              Already have an account?{" "}
              <button onClick={toggleMode} className="text-primary hover:underline">
                Sign In
              </button>
            </>
          ) : (
            <>
              New user?{" "}
              <button onClick={toggleMode} className="text-primary hover:underline">
                Sign Up
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
