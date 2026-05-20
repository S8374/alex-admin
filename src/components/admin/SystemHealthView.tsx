"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Clock 
} from "lucide-react";
import { LogItem } from "./LogItem";

interface SystemHealthViewProps {
  health: any;
  activeTab: "traffic" | "logs";
  setActiveTab: (tab: "traffic" | "logs") => void;
  handleClearLogs: () => void;
  handleDeleteHistory: (id: string) => void;
  getLogIcon: (message: string, level: string) => any;
  getLogColor: (message: string, level: string) => string;
  formatUptime: (seconds: number) => string;
}

export function SystemHealthView({ 
  health, 
  activeTab, 
  setActiveTab, 
  handleClearLogs, 
  handleDeleteHistory,
  getLogIcon,
  getLogColor,
  formatUptime
}: SystemHealthViewProps) {
  
  const stats = [
    { 
      label: "System Status", 
      value: health?.status || "...", 
      icon: Server, 
      color: health?.status === "UP" ? "text-emerald-600" : "text-red-600", 
      bg: health?.status === "UP" ? "bg-emerald-50" : "bg-red-50" 
    },
    { 
      label: "DB Latency", 
      value: health ? `${health.database.latency}ms` : "...", 
      icon: Activity, 
      color: "text-[#85A1D1]", 
      bg: "bg-[#85A1D1]/5" 
    },
    { 
      label: "Memory Usage", 
      value: health?.system.memoryUsage.usagePercent || "...", 
      icon: Cpu, 
      color: "text-[#85A1D1]", 
      bg: "bg-[#85A1D1]/5" 
    },
    { 
      label: "System Uptime", 
      value: health ? formatUptime(health.uptime) : "...", 
      icon: Clock, 
      color: "text-[#85A1D1]", 
      bg: "bg-[#85A1D1]/5" 
    },
    { 
      label: "Security Level", 
      value: health?.security.unauthorizedAttempts === 0 ? "SECURE" : "WARNING", 
      icon: ShieldAlert, 
      color: health?.security.unauthorizedAttempts === 0 ? "text-emerald-600" : "text-red-600", 
      bg: health?.security.unauthorizedAttempts === 0 ? "bg-emerald-50" : "bg-red-50" 
    },
    { 
      label: "Environment", 
      value: health?.environment.toUpperCase() || "...", 
      icon: Server, 
      color: "text-[#85A1D1]", 
      bg: "bg-[#85A1D1]/5" 
    },
  ];

  const sysInfo = [
    { label: "Node Version", value: health?.system.nodeVersion },
    { label: "Platform", value: health?.system.platform },
    { label: "Free Memory", value: health?.system.memoryUsage.free },
    { label: "Total Memory", value: health?.system.memoryUsage.total },
  ];

  return (
    <motion.div 
      key="health"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Health</h1>
          <p className="text-gray-600 font-semibold text-sm">Monitor core platform infrastructure and security alerts</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleClearLogs}
            className="h-11 px-6 bg-white border border-gray-200 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear System Logs
          </button>
          <button className="h-11 px-6 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat: any, idx: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-gray-50`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#85A1D1] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Server className="w-32 h-32 text-black" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Deep Infrastructure</h3>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Real-time Runtime Audit</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-black/10 rounded-lg border border-black/10">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Active Runtime</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {sysInfo.map((info: any) => (
                  <div key={info.label} className="space-y-1">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{info.label}</p>
                    <p className="text-sm font-bold font-mono">{info.value || "---"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-sm h-[650px]">
            <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-gray-900">Activity & Event Monitoring</h3>
                  <p className="text-xs text-gray-600 font-bold">Real-time platform audit trail</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab("traffic")}
                    className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                      activeTab === "traffic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                    }`}
                  >
                    LIVE TRAFFIC
                  </button>
                  <button 
                    onClick={() => setActiveTab("logs")}
                    className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                      activeTab === "logs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                    }`}
                  >
                    SERVER LOGS
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
              <AnimatePresence mode="wait">
                {activeTab === "traffic" ? (
                  <motion.div
                    key="traffic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {health?.websiteActivity
                      .filter((log: any) => !log.message.includes("/health"))
                      .map((log: any) => (
                      <LogItem 
                        key={log.details.requestId}
                        log={log} 
                        onDelete={() => handleDeleteHistory(log.details.requestId)}
                        icon={getLogIcon(log.message, log.level)}
                        colorClass={getLogColor(log.message, log.level)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {health?.serverHistory
                      .filter((log: any) => !log.message.includes("/health"))
                      .map((log: any, idx: number) => (
                      <LogItem 
                        key={idx}
                        log={log} 
                        icon={getLogIcon(log.message, log.level)}
                        colorClass={getLogColor(log.message, log.level)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900">Security Alerts</h3>
              <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-3">
              {health?.security.alerts.map((alert: string, idx: number) => (
                <div key={idx} className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <p className="text-xs font-bold text-red-700 leading-relaxed">{alert}</p>
                </div>
              ))}
              {(!health?.security.alerts || health.security.alerts.length === 0) && (
                <div className="p-8 text-center text-gray-300">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest">No active alerts</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900">Access Blacklist</h3>
              <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded text-gray-500">
                {health?.security.databaseBlacklist.length || 0} BLOCKED
              </span>
            </div>
            <div className="space-y-4">
              {health?.security.databaseBlacklist.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                      IP
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900">{item.ip}</p>
                      <p className="text-[10px] font-bold text-gray-500">{new Date(item.blockedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-[#85A1D1] opacity-0 group-hover:opacity-100 transition-all hover:underline">
                    UNBLOCK
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
