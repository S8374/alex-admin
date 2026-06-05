"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Server,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Cpu,
  Clock,
  Eye,
  Search,
  MoreHorizontal
} from "lucide-react";

interface SystemHealthViewProps {
  health: any;
  activeTab: "traffic" | "logs" | "alerts";
  setActiveTab: (tab: "traffic" | "logs" | "alerts") => void;
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
  const [trafficSearch, setTrafficSearch] = useState("");
  const [trafficLevel, setTrafficLevel] = useState("all");
  const [trafficPage, setTrafficPage] = useState(1);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsLevel, setLogsLevel] = useState("all");
  const [logsPage, setLogsPage] = useState(1);
  const [alertsSearch, setAlertsSearch] = useState("");
  const [alertsPage, setAlertsPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>([]);
  const pageSize = 5;

  const normalize = (value: string) => value.toLowerCase();

  const matchesLog = (log: any, search: string, level: string) => {
    const text = [log.message, log.level, JSON.stringify(log.details ?? {})].join(" ").toLowerCase();
    const matchesSearch = !search || text.includes(search.toLowerCase());
    const matchesLevel = level === "all" || normalize(log.level) === level;
    return matchesSearch && matchesLevel;
  };

  const activityLogs = useMemo(() => {
    return (health?.websiteActivity ?? []).filter((log: any) => !log.message.includes("/health") && matchesLog(log, trafficSearch, trafficLevel));
  }, [health?.websiteActivity, trafficSearch, trafficLevel]);

  const serverLogs = useMemo(() => {
    return (health?.serverHistory ?? []).filter((log: any) => !log.message.includes("/health") && matchesLog(log, logsSearch, logsLevel));
  }, [health?.serverHistory, logsSearch, logsLevel]);

  const activityTotalPages = Math.max(1, Math.ceil(activityLogs.length / pageSize));
  const serverTotalPages = Math.max(1, Math.ceil(serverLogs.length / pageSize));
  const alertsList = useMemo(() => (health?.security?.alerts ?? []).filter((a: string) => !alertsSearch || a.toLowerCase().includes(alertsSearch.toLowerCase())), [health?.security?.alerts, alertsSearch]);
  const alertsTotalPages = Math.max(1, Math.ceil(alertsList.length / pageSize));
  const safeTrafficPage = Math.min(trafficPage, activityTotalPages);
  const safeLogsPage = Math.min(logsPage, serverTotalPages);
  const safeAlertsPage = Math.min(alertsPage, alertsTotalPages);
  const visibleActivityLogs = activityLogs.slice((safeTrafficPage - 1) * pageSize, safeTrafficPage * pageSize);
  const visibleServerLogs = serverLogs.slice((safeLogsPage - 1) * pageSize, safeLogsPage * pageSize);
  const visibleAlerts = alertsList.slice((safeAlertsPage - 1) * pageSize, safeAlertsPage * pageSize);

  const getRequestId = (log: any, index: number) => log?.details?.requestId || log?.details?.id || `${log.timestamp}-${index}`;

  const titleCase = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

  const getFriendlyRouteLabel = (path?: string) => {
    if (!path) {
      return "This request";
    }

    const cleanPath = path.split("?")[0];
    const segments = cleanPath.split("/").filter(Boolean);
    const routeSegments = segments[0] === "admin" ? segments.slice(1) : segments;
    const firstSegment = routeSegments[0] || "";

    const routeMap: Record<string, string> = {
      "user-management": "User management",
      "application-management": "Application management",
      "quote-management": "Quotes management",
      "questionnaire": "Health questionnaire",
      "payment": "Payments",
      "payments": "Payments",
      "chat": "Chat",
      "health": "System health",
      "dashboard": "Dashboard"
    };

    if (routeMap[firstSegment]) {
      return routeMap[firstSegment];
    }

    if (!firstSegment) {
      return "This request";
    }

    return titleCase(firstSegment.replace(/-/g, " "));
  };

  const summarizeLogMessage = (message: string) => {
    const trimmed = message.replace(/^[📩⚠️✅🛡️⚙ ]+/, "").trim();

    const requestMatch = message.match(/^(?:📩\s*)?\[([A-Z]+)\]\s*([^|]+)\s*\|\s*Status:\s*(\d{3})\s*\|\s*Time:\s*(\d+)ms/i);
    if (requestMatch) {
      const method = requestMatch[1];
      const path = requestMatch[2].trim();
      const status = Number(requestMatch[3]);
      const time = Number(requestMatch[4]);
      const routeLabel = getFriendlyRouteLabel(path);
      const seconds = `${(time / 1000).toFixed(time >= 1000 ? 1 : 0)}s`;

      let title = `${routeLabel} request completed`;
      if (method === "GET") {
        title = `${routeLabel} loaded successfully`;
      } else if (method === "POST") {
        title = `${routeLabel} was created successfully`;
      } else if (method === "PUT" || method === "PATCH") {
        title = `${routeLabel} was updated successfully`;
      } else if (method === "DELETE") {
        title = `${routeLabel} was removed successfully`;
      }

      if (status >= 400 && status < 500) {
        title = `There was a problem opening ${routeLabel.toLowerCase()}`;
      } else if (status >= 500) {
        title = `Server error while loading ${routeLabel.toLowerCase()}`;
      }

      const statusLabel = status >= 500 ? "Server error" : status >= 400 ? "Needs attention" : "Success";

      return {
        title,
        subtitle: `${statusLabel} • ${seconds}`,
        raw: trimmed
      };
    }

    if (message.includes("ABORTED")) {
      const abortMatch = message.match(/^(?:⚠️\s*)?ABORTED\s*\[([A-Z]+)\]\s*([^|]+)\s*\|\s*Time:\s*(\d+)ms/i);
      if (abortMatch) {
        const routeLabel = getFriendlyRouteLabel(abortMatch[2].trim());
        return {
          title: `${routeLabel} request stopped before it finished`,
          subtitle: `Interrupted after ${(Number(abortMatch[3]) / 1000).toFixed(1)}s`,
          raw: trimmed
        };
      }

      return {
        title: "A request was stopped before it finished",
        subtitle: "Interrupted before completion",
        raw: trimmed
      };
    }

    return {
      title: trimmed || "System activity",
      subtitle: "",
      raw: trimmed || message
    };
  };

  const openResponse = (log: any) => {
    setSelectedLog(log);
  };

  const closeResponse = () => {
    setSelectedLog(null);
  };

  const toggleMessageExpanded = (id: string) => {
    setExpandedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const safeParseJson = (value: any) => {
    if (value == null) {
      return null;
    }

    if (typeof value === "object") {
      return value;
    }

    if (typeof value !== "string") {
      return value;
    }

    let parsed: any = value.trim();
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (typeof parsed !== "string") {
        break;
      }

      try {
        parsed = JSON.parse(parsed);
      } catch {
        break;
      }
    }

    return parsed;
  };

  const formatValuePreview = (value: any) => {
    if (value == null || value === "") {
      return "Not provided";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return `${value.length} item${value.length === 1 ? "" : "s"}`;
    }

    if (typeof value === "object") {
      return `${Object.keys(value).length} field${Object.keys(value).length === 1 ? "" : "s"}`;
    }

    return String(value);
  };

  const getResponseSummary = (log: any) => {
    const parsedResponse = safeParseJson(log?.details?.response);
    const responseObject = parsedResponse && typeof parsedResponse === "object" ? parsedResponse : null;
    const responseMessage = responseObject?.message || responseObject?.error || responseObject?.statusMessage || "";
    const responseData = responseObject?.data;
    const responseMeta = responseObject?.meta;
    const responseFields = [
      { label: "Success", value: responseObject?.success },
      { label: "Message", value: responseMessage },
      { label: "Data", value: responseData },
      { label: "Meta", value: responseMeta },
    ].filter((item) => item.value !== undefined);

    return {
      responseObject,
      responseMessage,
      responseFields,
    };
  };

  const renderResponsePayload = (log: any) => {
    if (!log) {
      return "{}";
    }

    return JSON.stringify(
      {
        timestamp: log.timestamp,
        level: log.level,
        message: log.message,
        details: log.details,
        response: safeParseJson(log?.details?.response),
      },
      null,
      2
    );
  };

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
      color: "text-primary",
      bg: "bg-primary/5"
    },
    {
      label: "Memory Usage",
      value: health?.system.memoryUsage.usagePercent || "...",
      icon: Cpu,
      color: "text-primary",
      bg: "bg-primary/5"
    },
    {
      label: "System Uptime",
      value: health ? formatUptime(health.uptime) : "...",
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/5"
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
      color: "text-primary",
      bg: "bg-primary/5"
    },
  ];

  const sysInfo = [
    { label: "Node Version", value: health?.system.nodeVersion },
    { label: "Platform", value: health?.system.platform },
    { label: "Free Memory", value: health?.system.memoryUsage.free },
    { label: "Total Memory", value: health?.system.memoryUsage.total },
  ];

  const renderLogTable = (logs: any[], page: number, totalPages: number, onPageChange: (page: number) => void, emptyMessage: string) => (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50/90 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Request / ID</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length > 0 ? logs.map((log: any, index: number) => {
              const requestId = getRequestId(log, index);
              const isExpanded = expandedMessageIds.includes(requestId);
              const logSummary = summarizeLogMessage(log.message);
              return (
                <tr key={requestId} className="align-top transition-colors hover:bg-gray-50/70">
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-bold text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${getLogColor(log.message, log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-4 min-w-70 max-w-140">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${getLogColor(log.message, log.level)}`}>
                        {(() => {
                          const Icon = getLogIcon(log.message, log.level);
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                      <div className="min-w-0 space-y-1">
                        {isExpanded ? (
                          <p className="text-sm font-bold text-gray-900 leading-snug wrap-break-word">{logSummary.raw}</p>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-gray-900 leading-snug wrap-break-word">{logSummary.title}</p>
                            {logSummary.subtitle && <p className="text-[11px] font-semibold text-gray-500">{logSummary.subtitle}</p>}
                          </>
                        )}
                        <button
                          onClick={() => toggleMessageExpanded(requestId)}
                          className="text-[10px] font-black uppercase tracking-widest text-[#6F88B9] hover:underline"
                        >
                          {isExpanded ? "Hide technical details" : "Show technical details"}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-55">
                    <div className="space-y-2 text-xs font-semibold text-gray-500">
                      <div className="rounded-xl bg-gray-50 px-3 py-2">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Request ID</span>
                        <span className="mt-1 block break-all text-gray-700">{requestId}</span>
                      </div>
                      {log.details?.ip && (
                        <div className="rounded-xl bg-gray-50 px-3 py-2">
                          <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">IP</span>
                          <span className="mt-1 block break-all text-gray-700">{log.details.ip}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="relative inline-flex">
                      <button
                        onClick={() => setOpenActionId(openActionId === requestId ? null : requestId)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        aria-label="Open row actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openActionId === requestId && (
                        <div className="absolute right-0 top-11 z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                          <button
                            onClick={() => {
                              openResponse(log);
                              setOpenActionId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-black uppercase tracking-widest text-[#6F88B9] hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                            Full Response
                          </button>
                          {log.details?.requestId && (
                            <button
                              onClick={() => {
                                handleDeleteHistory(log.details.requestId);
                                setOpenActionId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm font-bold text-gray-500">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAlertsTable = (alerts: string[], page: number, totalPages: number, onPageChange: (page: number) => void, emptyMessage: string) => (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50/90 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Alert</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alerts.length > 0 ? alerts.map((alert: string, idx: number) => (
              <tr key={idx} className="align-top transition-colors hover:bg-gray-50/70">
                <td className="px-4 py-4 text-xs font-black text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-bold text-red-700">{alert}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedLog({ timestamp: new Date().toISOString(), level: 'ALERT', message: alert, details: {} })}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#6F88B9] hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <p className="text-sm font-bold text-gray-500">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      key="health"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">System Health</h1>
          <p className="text-gray-600 font-semibold text-sm">Monitor core platform infrastructure and security alerts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
          <button
            onClick={handleClearLogs}
            className="h-11 px-4 sm:px-6 bg-white border border-gray-200 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear System Logs
          </button>
        
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
        {stats.map((stat: any, idx: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
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

        <div className="w-full bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-[0_18px_50px_rgba(15,23,42,0.06)] min-w-0 min-h-135 lg:min-h-162.5">
            <div className="p-5 sm:p-6 border-b border-gray-50 bg-white/95 backdrop-blur sticky top-0 z-10 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-black text-gray-900">Security Alerts</h3>
                  <p className="text-xs text-gray-600 font-bold">Real-time system security notifications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search</span>
                  <input
                    value={alertsSearch}
                    onChange={(event) => {
                      setAlertsSearch(event.target.value);
                      setAlertsPage(1);
                    }}
                    placeholder="Message"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </label>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Per page</p>
                    <p className="text-sm font-bold text-gray-700">{pageSize} items</p>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Showing</p>
                    <p className="text-sm font-bold text-gray-700">
                      {`${Math.min((safeAlertsPage - 1) * pageSize + 1, alertsList.length)}-${Math.min(safeAlertsPage * pageSize, alertsList.length) || 0} of ${alertsList.length}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-gray-50/50">
              <AnimatePresence mode="wait">
                  <motion.div
                    key="alerts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {renderAlertsTable(
                      visibleAlerts,
                      safeAlertsPage,
                      alertsTotalPages,
                      setAlertsPage,
                      "No security alerts found."
                    )}
                  </motion.div>
              </AnimatePresence>
            </div>
        </div>

      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeResponse}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Full Response</p>
                  <h3 className="text-lg font-black text-gray-900">{summarizeLogMessage(selectedLog.message).title}</h3>
                  <p className="text-xs font-semibold text-gray-500">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <button
                  onClick={closeResponse}
                  className="rounded-full border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50/60 p-4 sm:p-6 custom-scrollbar space-y-4">
                {(() => {
                  const summary = summarizeLogMessage(selectedLog.message);
                  const responseSummary = getResponseSummary(selectedLog);
                  const requestDetails = [
                    { label: "Request ID", value: selectedLog?.details?.requestId },
                    { label: "User", value: selectedLog?.details?.userId },
                    { label: "IP", value: selectedLog?.details?.ip },
                    { label: "Status", value: summary.subtitle || selectedLog.level },
                  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

                  return (
                    <>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">What happened</p>
                          <p className="mt-2 text-sm font-bold text-gray-900">{summary.title}</p>
                          {summary.subtitle && <p className="mt-1 text-xs font-semibold text-gray-500">{summary.subtitle}</p>}
                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {requestDetails.map((item) => (
                              <div key={item.label} className="rounded-xl bg-gray-50 px-3 py-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-700">{formatValuePreview(item.value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">What the system returned</p>
                          <p className="mt-2 text-sm font-bold text-gray-900">
                            {responseSummary.responseMessage || "A response was captured for this request."}
                          </p>
                          <div className="mt-4 space-y-2">
                            {responseSummary.responseFields.map((item) => (
                              <div key={item.label} className="rounded-xl bg-gray-50 px-3 py-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-700">{formatValuePreview(item.value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <details className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-[#6F88B9]">
                          Technical JSON
                        </summary>
                        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap wrap-break-word rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs font-mono font-medium leading-relaxed text-gray-700">
                          {renderResponsePayload(selectedLog)}
                        </pre>
                      </details>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
