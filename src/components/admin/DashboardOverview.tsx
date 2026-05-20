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
}

export function DashboardOverview({ setActiveView }: DashboardOverviewProps) {
  const overviewStats = [
    { label: "Total Users", value: "1,248" },
    { label: "Active Policies", value: "856" },
    { label: "Pending Quotes", value: "42" },
    { label: "System Health", value: "99.9%" },
    { label: "Alerts", value: "0" },
    { label: "Platform", value: "v2.0" },
  ];

  const overviewModules = [
    {
      title: "User Management",
      desc: "Create, update, delete users and block/unblock access.",
      icon: Users,
      action: () => setActiveView("users")
    },
    {
      title: "Pet Records",
      desc: "Review and manage all registered pet health records and status.",
      icon: Dog,
    },
    
    {
      title: "Agreement Documents",
      desc: "Review pending agreements and manage legal documentation.",
      icon: ClipboardList,
    },
    {
      title: "Quote Management",
      desc: "Review pending quote requests and approved premiums.",
      icon: FileSpreadsheet,
    },
    {
      title: "Questionnaires",
      desc: "Manage onboarding questionnaires and master templates.",
      icon: FileText,
    },
    {
      title: "System Health",
      desc: "Monitor core platform infrastructure and security alerts.",
      icon: Activity,
      action: () => setActiveView("health")
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
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 font-semibold">Choose a management module below.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {overviewStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 hover:border-[#85A1D1]/20 transition-colors group">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 group-hover:text-[#85A1D1] transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {overviewModules.map((mod: any, idx: number) => (
          <div 
            key={idx} 
            onClick={() => mod.action?.()}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5 hover:border-[#85A1D1]/20 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#85A1D1]/10 rounded-lg flex items-center justify-center text-[#85A1D1]">
              <mod.icon className="w-4 h-4" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-black text-gray-900 group-hover:text-[#85A1D1] transition-colors">{mod.title}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                {mod.desc}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#85A1D1] text-[10px] font-bold">
              Open module <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
