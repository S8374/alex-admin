"use client";

import { AnimatePresence } from "framer-motion";
import {
  Bell,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Server,
  Users
} from "lucide-react";
import { inter } from "@/app/fonts";
import { useGetServerMonitoringQuery, useDeleteServerHistoryMutation, useDeleteSpasicHistoryMutation } from "@/redux/api/monitoringApi";
import { toast } from "sonner";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Refactored Components
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { SystemHealthView } from "@/components/admin/SystemHealthView";
import { UserManagementView } from "@/components/admin/pages/UserManagementView";
import { QuotesManagementView } from "@/components/admin/pages/QuotesManagementView";
import { AgreementManagementView } from "@/components/admin/pages/AgreementManagementView";
import { QuestionnaireManagementView } from "@/components/admin/pages/QuestionnaireManagementView";
import { PaymentManagementView } from "@/components/admin/pages/PaymentManagementView";
import { ChatManagementView } from "@/components/admin/pages/ChatManagementView";
import { ApplicationManagementView } from "@/components/admin/pages/ApplicationManagementView";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"traffic" | "logs">("traffic");
  const [activeView, setActiveView] = useState<"overview" | "health" | "users" | "quotes" | "agreements" | "questionnaires" | "payments" | "chat" | "applications">("overview");
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: monitoringResponse, isFetching, refetch } = useGetServerMonitoringQuery(undefined, {
    pollingInterval: 30000,
  });

  const [deleteHistory] = useDeleteServerHistoryMutation();
  const [clearAllHistory] = useDeleteSpasicHistoryMutation();

  const health = monitoringResponse?.data;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    toast.success("Logged out successfully");
  };

  const handleClearLogs = async () => {
    try {
      await clearAllHistory(undefined).unwrap();
      toast.success("All logs cleared");
    } catch (error) {
      toast.error("Failed to clear logs");
    }
  };

  const handleDeleteHistory = async (requestId: string) => {
    try {
      await deleteHistory(requestId).unwrap();
      toast.success("Log entry deleted");
    } catch (error) {
      toast.error("Failed to delete log");
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getLogIcon = (message: string, level: string) => {
    if (message.includes("SECURITY")) return ShieldAlert;
    if (message.includes("Database") || message.includes("Prisma")) return Server;
    if (message.includes("Auth") || message.includes("token")) return ShieldCheck;
    return Activity;
  };

  const getLogColor = (message: string, level: string) => {
    if (message.includes("SECURITY") || level === "ERROR") return "text-red-600 bg-red-50 border-red-100";
    if (message.includes("Database")) return "text-purple-600 bg-purple-50 border-purple-100";
    if (message.includes("Auth")) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-[#85A1D1] bg-[#85A1D1]/5 border-[#85A1D1]/10";
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 text-gray-900 ${inter.className}`}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <Header refetch={refetch} isFetching={isFetching} />

        <div className="flex-1 p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeView === "overview" && (
              <DashboardOverview setActiveView={setActiveView} />
            )}

            {activeView === "health" && (
              <SystemHealthView
                health={health}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleClearLogs={handleClearLogs}
                handleDeleteHistory={handleDeleteHistory}
                getLogIcon={getLogIcon}
                getLogColor={getLogColor}
                formatUptime={formatUptime}
              />
            )}

            {activeView === "users" && (
              <UserManagementView />
            )}

            {activeView === "quotes" && (
              <QuotesManagementView />
            )}

            {activeView === "agreements" && (
              <AgreementManagementView />
            )}

            {activeView === "questionnaires" && (
              <QuestionnaireManagementView />
            )}

            {activeView === "payments" && (
              <PaymentManagementView />
            )}

            {activeView === "chat" && (
              <ChatManagementView />
            )}

            {activeView === "applications" && (
              <ApplicationManagementView setActiveView={setActiveView} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
