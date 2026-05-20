import { AuthShell } from "@/components/auth/shared/AuthShell";
import { AUTH_SLIDES } from "@/app/data/authConfig";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <AuthShell slide={AUTH_SLIDES.login}>
      <AdminLoginForm />
    </AuthShell>
  );
}
