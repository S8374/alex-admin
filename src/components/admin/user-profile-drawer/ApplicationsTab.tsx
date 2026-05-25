"use client";

import React from "react";
import { ClipboardList, Calendar, ArrowRight, Dog, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApplicationsTabProps {
  user: any;
  isLoading?: boolean;
}

export function ApplicationsTab({ user, isLoading = false }: ApplicationsTabProps) {
  if (isLoading) {
    return <ApplicationsSkeleton />;
  }

  const applications = user?.applications || [];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#85A1D1]" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Enrollment History</h3>
        </div>
        <Badge variant="outline" className="bg-[#85A1D1]/5 text-[#85A1D1] border-[#85A1D1]/20 font-bold text-xs px-3">
          {applications.length} Records
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.length > 0 ? (
          applications.map((app: any) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#85A1D1]">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {app.id.split('-')[0].toUpperCase()}</span>
                        <Badge className={`rounded-md font-bold text-[9px] uppercase px-2 py-0.5 ${
                          app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                          app.status === 'DECLINED' ? 'bg-red-50 text-red-600' : 
                          'bg-[#85A1D1]/10 text-[#85A1D1]'
                        }`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-gray-400 truncate max-w-[200px] md:max-w-md">{app.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Included Pets</p>
                      <div className="flex items-center gap-2">
                        <Dog className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">{app.pets?.length || 0} Members</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questionnaire</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${app.questionnaireId ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-sm font-bold text-gray-900">{app.questionnaireId ? 'Finalized' : 'Incomplete'}</span>
                      </div>
                    </div>
                    <div className="space-y-1 hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submission</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">{new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between md:justify-center gap-4">
                   <div className="md:text-right">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Update</p>
                     <p className="text-xs font-bold text-gray-900">{new Date(app.updatedAt || app.createdAt).toLocaleDateString()}</p>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-bold text-[#85A1D1] uppercase tracking-[0.2em] hover:text-gray-900 transition-all group/btn">
                     Audit Log <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No enrollment records found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="h-4 w-56 rounded-full bg-gray-200" />
        <div className="h-7 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
            <div className="h-4 w-40 rounded-full bg-gray-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-16 rounded-xl bg-gray-100" />
              <div className="h-16 rounded-xl bg-gray-100" />
              <div className="h-16 rounded-xl bg-gray-100" />
            </div>
            <div className="h-10 w-28 rounded-full bg-gray-100 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
