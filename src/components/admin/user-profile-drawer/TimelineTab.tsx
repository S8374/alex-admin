"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, History, Activity } from "lucide-react";

interface TimelineTabProps {
  user: any;
  isLoading?: boolean;
}

export function TimelineTab({ user, isLoading = false }: TimelineTabProps) {
  if (isLoading) {
    return <TimelineSkeleton />;
  }

  const activities = user.activities || [];

  const formatTimelineDate = (value: string) => {
    return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 min-w-0">
          <History className="w-5 h-5 text-[#85A1D1]" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest wrap-break-word">Account Timeline</h3>
        </div>
        <Badge variant="outline" className="bg-[#85A1D1]/5 text-[#85A1D1] border-[#85A1D1]/20 font-bold text-xs px-3">
          {activities.length} Events
        </Badge>
      </div>

      <div className="relative pl-5 sm:pl-6 space-y-6 sm:space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
        {activities.length > 0 ? (
          activities.map((activity: any) => (
            <div key={activity.id} className="relative group">
              <div className="absolute -left-5 sm:-left-6 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#85A1D1] shadow-sm z-10 transition-transform group-hover:scale-125" />
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <p className="text-sm font-bold text-gray-900 tracking-tight wrap-break-word">{activity.title}</p>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimelineDate(activity.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4 wrap-break-word">{activity.message}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Badge className="rounded-lg text-[10px] font-bold uppercase border-none bg-gray-100 text-gray-500 px-2 py-0.5">
                    {activity.type || "System Event"}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#85A1D1] uppercase tracking-widest shrink-0">
                    <Activity className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200 -ml-5 sm:-ml-6 px-4">
            <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest wrap-break-word">No recent timeline events</p>
            <p className="text-xs text-gray-400 mt-2 wrap-break-word">New activity will be logged here in real-time</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="h-4 w-48 rounded-full bg-gray-200" />
        <div className="h-7 w-24 rounded-full bg-gray-200" />
      </div>

      <div className="relative pl-5 sm:pl-6 space-y-6 sm:space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-5 sm:-left-6 top-1.5 w-3 h-3 rounded-full bg-gray-200" />
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="h-4 w-40 rounded-full bg-gray-200" />
                <div className="h-3 w-32 rounded-full bg-gray-200" />
              </div>
              <div className="h-4 w-full rounded-full bg-gray-100" />
              <div className="flex items-center justify-between gap-3">
                <div className="h-6 w-24 rounded-full bg-gray-100" />
                <div className="h-3 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
