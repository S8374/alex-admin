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
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useGetAllApplicationsQuery } from "@/redux/api/quoteApi";
import { useGetActiveQuestionnaireQuery } from "@/redux/api/QuestionnaireApi";
import { useGetPaymentStatsQuery } from "@/redux/api/PaymentApi";
import { useLogoutMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { logout } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Refactored Components
import { Sidebar, SidebarSheetContent } from "@/components/admin/Sidebar";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ACTIVE_VIEW_STORAGE_KEY = "alex-admin-active-view";

const validViews = [
  "overview",
  "health",
  "users",
  "quotes",
  "questionnaires",
  "payments",
  "chat",
  "applications",
] as const;

type ActiveView = (typeof validViews)[number];

function isActiveView(value: string | null): value is ActiveView {
  return !!value && validViews.includes(value as ActiveView);
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"traffic" | "logs" | "alerts">("traffic");
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window === "undefined") {
      return "overview";
    }

    return isActiveView(window.localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY))
      ? window.localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY) as ActiveView
      : "overview";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: monitoringResponse, isFetching, refetch } = useGetServerMonitoringQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: usersResponse } = useGetAllUsersQuery({ page: 1, limit: 1, search: "", role: "", status: "" });
  const { data: applicationsResponse } = useGetAllApplicationsQuery(undefined);
  const { data: questionnaireResponse } = useGetActiveQuestionnaireQuery(undefined);
  const { data: paymentStatsResponse } = useGetPaymentStatsQuery(undefined);

  const [deleteHistory] = useDeleteServerHistoryMutation();
  const [clearAllHistory] = useDeleteSpasicHistoryMutation();
  const [logoutApi] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const health = monitoringResponse?.data;
  const allApplications = applicationsResponse?.data || [];
  const totalUsers = usersResponse?.meta?.pagination?.total || 0;
  const activePolicies = allApplications.filter((application: any) => application.status === "APPROVED").length;
  const pendingQuotes = allApplications.filter((application: any) => ["SUBMITTED", "UNDER_REVIEW"].includes(application.status)).length;
  const questionnaireQuestions = questionnaireResponse?.data?.questions?.length || 0;
  const paymentTransactions = paymentStatsResponse?.data?.totalTransactions || 0;
  const alerts = health?.security?.alerts?.length || 0;
  const summary = {
    totalUsers,
    activePolicies,
    pendingQuotes,
    questionnaireQuestions,
    paymentTransactions,
    alerts,
    systemHealth: health?.status === "UP" ? "Healthy" : (health?.status || "Loading"),
    platform: health?.environment?.toUpperCase() || "LIVE",
  };

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, activeView);
  }, [activeView]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logoutApi(undefined).unwrap();
    } catch {
      // Even if API fails, clear local state so user can continue.
    } finally {
      dispatch(logout());
      setMobileSidebarOpen(false);
      router.push("/");
      toast.success("Logged out successfully");
      setIsLoggingOut(false);
    }
  };

  const handleSetActiveView = (view: ActiveView) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
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
      <div className="hidden lg:block">
        <Sidebar
          activeView={activeView}
          setActiveView={handleSetActiveView}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-[320px] p-0 border-r border-gray-100 bg-white" showCloseButton>
          <SidebarSheetContent
            activeView={activeView}
            setActiveView={handleSetActiveView}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <Header refetch={refetch} isFetching={isFetching} onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeView === "overview" && (
              <DashboardOverview setActiveView={handleSetActiveView} summary={summary} />
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
              <ApplicationManagementView setActiveView={handleSetActiveView} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
