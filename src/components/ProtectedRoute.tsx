"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authUser = useSelector((state: any) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authUser) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.replace("/");
    }
  }, [authUser, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return null; // Let the useEffect redirect
  }

  return <>{children}</>;
}
