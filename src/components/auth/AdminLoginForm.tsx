"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { AuthInput } from "./shared/AuthInput";
import { AuthButton } from "./shared/AuthButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/authSlice";

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      window.location.replace("/admin/dashboard");
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await adminLogin(values).unwrap();
      
      if (response.success) {
        dispatch(setUser({ 
          user: response.data.user, 
          token: response.data.accessToken 
        }));
        
        toast.success("Welcome back, Admin!");
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.error?.message || error?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left space-y-2">
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black text-foreground tracking-tight"
        >
          Admin Login
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground font-medium"
        >
          Access the AlexGarrett Admin Control Center
        </motion.p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          label="Administrator Email"
          placeholder="Enter Your Admin Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          disabled={isLoading}
          rightElement={<Mail className="w-4 h-4 text-muted-foreground" />}
        />

        <AuthInput
          label="Secure Password"
          placeholder="••••••••••••"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={errors.password?.message}
          disabled={isLoading}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          }
        />

        <div className="pt-2">
          <AuthButton isLoading={isLoading} type="submit">
            Authenticate Account
          </AuthButton>
        </div>
      </form>

      {/* Support Section */}
      <div className="pt-6 border-t border-gray-100">
        <p className="text-center text-xs text-muted-foreground font-medium leading-relaxed">
          Trouble logging in? Contact the <a href="#" className="text-primary font-bold hover:underline">Systems Administrator</a> for assistance or to recover your credentials.
        </p>
      </div>
    </div>
  );
}
