import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/shared/AuthShell";
import { AUTH_SLIDES } from "@/app/data/authConfig";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/admin/dashboard");
  }

  return (
    <AuthShell slide={AUTH_SLIDES.login}>
      <AdminLoginForm />
    </AuthShell>
  );
}
