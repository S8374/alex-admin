"use client";

import React from "react";
import { User, Shield, Phone, MapPin, Briefcase, Mail } from "lucide-react";

interface OverviewTabProps {
  user: any;
  isLoading?: boolean;
}

export function OverviewTab({ user, isLoading = false }: OverviewTabProps) {
  const personInfos = user.personInfos?.[0];
  const representative = user.applications?.[0]?.representative;

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  const InfoCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const DataField = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <InfoCard title="Personal Information" icon={User}>
          {personInfos ? (
            <>
              <DataField 
                label="Legal Full Name" 
                value={`${personInfos.firstName} ${personInfos.middleInitial ? `${personInfos.middleInitial}. ` : ""}${personInfos.lastName}`} 
              />
              <DataField 
                label="Residential Address" 
                value={
                  <div className="leading-relaxed">
                    {personInfos.streetAddress}<br />
                    <span className="text-gray-500">{personInfos.city}, {personInfos.state} {personInfos.zipCode}</span>
                  </div>
                } 
              />
              <div className="grid grid-cols-2 gap-4">
                <DataField label="Contact Number" value={personInfos.cellPhone || "N/A"} />
                <DataField label="SSN (Last 4)" value={personInfos.ssnLast4 || "N/A"} />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No personal records found.</p>
          )}
        </InfoCard>

        {/* Representative Details */}
        <InfoCard title="Representative" icon={Shield}>
          {representative ? (
            <>
              <div className="flex items-start justify-between">
                <DataField label="Full Name" value={representative.fullName} />
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold uppercase">
                  {representative.relationship}
                </Badge>
              </div>
              <DataField 
                label="Assigned Location" 
                value={`${representative.city || "N/A"}, ${representative.state || "N/A"} ${representative.zipCode || ""}`} 
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {representative.cellPhone || representative.phoneNumber || "N/A"}
                </div>
                {representative.email && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {representative.email}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale">
              <Briefcase className="w-10 h-10 mb-2" />
              <p className="text-xs font-bold uppercase">No representative assigned</p>
            </div>
          )}
        </InfoCard>
      </div>

      {/* System Status / Quick Info */}
      <div className="bg-gray-900 rounded-xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Account Eligibility</p>
            <p className="text-xl font-bold">Verified Member Profile</p>
          </div>
        </div>
        <div className="flex gap-10">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-lg font-bold">{user.status || 'ACTIVE'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined</p>
            <p className="text-lg font-bold">{new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-gray-200" />
            <div className="h-3 w-40 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-3/4 rounded-full bg-gray-200" />
            <div className="h-4 w-full rounded-full bg-gray-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 rounded-xl bg-gray-100" />
              <div className="h-16 rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-gray-200" />
            <div className="h-3 w-32 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-2/3 rounded-full bg-gray-200" />
            <div className="h-4 w-full rounded-full bg-gray-200" />
            <div className="h-12 w-full rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-8 shadow-xl animate-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-xl bg-white/10" />
            <div className="space-y-3 flex-1">
              <div className="h-3 w-32 rounded-full bg-white/10" />
              <div className="h-6 w-56 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex gap-10 w-full md:w-auto">
            <div className="space-y-2 flex-1 md:flex-none text-center">
              <div className="h-3 w-16 mx-auto rounded-full bg-white/10" />
              <div className="h-5 w-20 mx-auto rounded-full bg-white/10" />
            </div>
            <div className="space-y-2 flex-1 md:flex-none text-center">
              <div className="h-3 w-16 mx-auto rounded-full bg-white/10" />
              <div className="h-5 w-24 mx-auto rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline badge since we are in a tab component
function Badge({ children, variant, className }: any) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  )
}
