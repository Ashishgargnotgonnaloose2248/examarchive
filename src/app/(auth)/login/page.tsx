import { LoginForm } from '@/components/auth/LoginForm';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground font-headline">
            Academia Archive
          </h1>
          <p className="mt-2 text-muted-foreground">
            Access previous year question papers with your college ID.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
