export interface SystemHealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: string;
    latency: number;
  };
  system: {
    platform: string;
    nodeVersion: string;
    memoryUsage: {
      free: string;
      total: string;
      usagePercent: string;
    };
    cpuLoad: number[];
  };
  security: {
    totalRecentErrors: number;
    suspiciousIps: string[];
    criticalConditions: string[];
    unauthorizedAttempts: number;
    alerts: string[];
    databaseBlacklist: {
      id: string;
      ip: string;
      reason: string;
      blockedAt: string;
      expiresAt: string | null;
    }[];
  };
  websiteActivity: {
    timestamp: string;
    level: string;
    message: string;
    details: {
      query: Record<string, any>;
      params: Record<string, any>;
      response: string;
      userId: string;
      ip: string;
      requestId: string;
    };
  }[];
  serverHistory: {
    timestamp: string;
    level: string;
    message: string;
    details: Record<string, any>;
  }[];
}

export interface MonitoringResponse {
  success: boolean;
  message: string;
  data: SystemHealthData;
}
