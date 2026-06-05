"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Dog, 
  ClipboardList, 
  FileSpreadsheet, 
  FileText, 
  Activity, 
  ArrowRight 
} from "lucide-react";

interface DashboardOverviewProps {
  setActiveView: (view: any) => void;
  summary: {
    totalUsers: number;
    activePolicies: number;
    pendingQuotes: number;
    questionnaireQuestions: number;
    paymentTransactions: number;
    alerts: number;
    systemHealth: string;
    platform: string;
  };
}

type StatCard = {
  label: string;
  value: string;
  onClick?: () => void;
  accent?: string;
};

export function DashboardOverview({ setActiveView, summary }: DashboardOverviewProps) {
  const overviewStats: StatCard[] = [
    { label: "Total Users", value: summary.totalUsers.toLocaleString(), onClick: () => setActiveView("users") },
    { label: "Active Policies", value: summary.activePolicies.toLocaleString(), onClick: () => setActiveView("applications") },
    { label: "Pending Quotes", value: summary.pendingQuotes.toLocaleString(), onClick: () => setActiveView("quotes") },
    { label: "Questionnaire Questions", value: summary.questionnaireQuestions.toLocaleString(), onClick: () => setActiveView("questionnaires") },
    { label: "Payment Transactions", value: summary.paymentTransactions.toLocaleString(), onClick: () => setActiveView("payments") },
  ];

  const overviewModules = [
    {
      title: "User Management",
      desc: `${summary.totalUsers.toLocaleString()} users in the system. Create, update, delete users and block/unblock access.`,
      icon: Users,
      action: () => setActiveView("users"),
      metric: summary.totalUsers.toLocaleString(),
    },
    {
      title: "Pet Records",
      desc: `${summary.activePolicies.toLocaleString()} pet-linked policies available for review.`,
      icon: Dog,
      action: () => setActiveView("applications"),
      metric: summary.activePolicies.toLocaleString(),
    },
    {
      title: "Quote Management",
      desc: `${summary.pendingQuotes.toLocaleString()} quote request${summary.pendingQuotes === 1 ? "" : "s"} awaiting review.`,
      icon: FileSpreadsheet,
      action: () => setActiveView("quotes"),
      metric: summary.pendingQuotes.toLocaleString(),
    },
    {
      title: "Questionnaires",
      desc: `${summary.questionnaireQuestions.toLocaleString()} live questions in the active questionnaire.`,
      icon: FileText,
      action: () => setActiveView("questionnaires"),
      metric: summary.questionnaireQuestions.toLocaleString(),
    },
    {
      title: "System Health",
      desc: `${summary.systemHealth}${summary.platform ? ` · ${summary.platform}` : ""} · ${summary.alerts.toLocaleString()} active alert${summary.alerts === 1 ? "" : "s"}.`,
      icon: Activity,
      action: () => setActiveView("health"),
      metric: summary.systemHealth,
    }
  ];

  return (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 font-semibold">Choose a management module below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {overviewStats.map((stat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={stat.onClick}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 hover:border-primary/20 transition-colors group text-left disabled:cursor-default"
          >
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {overviewModules.map((mod: any, idx: number) => (
          <button 
            key={idx} 
            type="button"
            onClick={() => mod.action?.()}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5 hover:border-primary/20 transition-all cursor-pointer group text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <mod.icon className="w-4 h-4" />
              </div>
              {mod.metric && (
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">
                  {mod.metric}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{mod.title}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                {mod.desc}
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary text-[10px] font-bold">
              Open module <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
