import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
