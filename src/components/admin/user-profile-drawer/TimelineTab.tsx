"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, History, Activity } from "lucide-react";

interface TimelineTabProps {
  user: any;
}

export function TimelineTab({ user }: TimelineTabProps) {
  const activities = user.activities || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#85A1D1]" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Account Timeline</h3>
        </div>
        <Badge variant="outline" className="bg-[#85A1D1]/5 text-[#85A1D1] border-[#85A1D1]/20 font-bold text-xs px-3">
          {activities.length} Events
        </Badge>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
        {activities.length > 0 ? (
          activities.map((activity: any) => (
            <div key={activity.id} className="relative group">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#85A1D1] shadow-sm z-10 transition-transform group-hover:scale-125" />
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{activity.title}</p>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(activity.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4">{activity.message}</p>
                <div className="flex items-center justify-between">
                  <Badge className="rounded-lg text-[10px] font-bold uppercase border-none bg-gray-100 text-gray-500 px-2 py-0.5">
                    {activity.type || "System Event"}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#85A1D1] uppercase tracking-widest">
                    <Activity className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200 ml-[-1.5rem]">
            <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No recent timeline events</p>
            <p className="text-xs text-gray-400 mt-2">New activity will be logged here in real-time</p>
          </div>
        )}
      </div>
    </div>
  );
}
