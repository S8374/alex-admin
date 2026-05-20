"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, HeartPulse, Activity, CheckCircle2 } from "lucide-react";

interface HealthTabProps {
  user: any;
}

export function HealthTab({ user }: HealthTabProps) {
  const questionnaires = user.healthQuestionnaires || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#85A1D1]" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Medical Questionnaires</h3>
        </div>
        <Badge variant="outline" className="bg-[#85A1D1]/5 text-[#85A1D1] border-[#85A1D1]/20 font-bold text-xs px-3">
          {questionnaires.length} Records
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questionnaires.length > 0 ? (
          questionnaires.map((hq: any) => (
            <div key={hq.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="bg-gray-50/50 border-b border-gray-50 px-6 py-4 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">{hq.topicTitle || 'General Health Review'}</p>
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-medium text-gray-400">{new Date(hq.createdAt).toLocaleDateString()}</p>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">
                    Completed
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{hq.description || "Comprehensive medical history evaluation and health status update."}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#85A1D1] shadow-sm border border-gray-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Protocol Status</p>
                      <p className="text-[11px] text-gray-400 font-medium">HIPAA Compliant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Verification</p>
                      <p className="text-[11px] text-gray-400 font-medium">Identity Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No medical records on file</p>
            <p className="text-xs text-gray-400 mt-2">Health questionnaires will appear here once completed</p>
          </div>
        )}
      </div>
    </div>
  );
}
