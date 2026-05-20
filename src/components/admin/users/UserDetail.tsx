"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Hash,
  LayoutGrid,
  HeartPulse,
  Dog,
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  ClipboardList,
  History
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Reuse existing sub-tabs from the drawer folder
import { OverviewTab } from "../user-profile-drawer/OverviewTab";
import { ApplicationsTab } from "../user-profile-drawer/ApplicationsTab";
import { PetsTab } from "../user-profile-drawer/PetsTab";
import { FinancialsTab } from "../user-profile-drawer/FinancialsTab";
import { HealthTab } from "../user-profile-drawer/HealthTab";
import { TimelineTab } from "../user-profile-drawer/TimelineTab";

interface UserDetailProps {
  user: any;
  onBack: () => void;
  isLoading: boolean;
}

export const UserDetail = ({ user, onBack, isLoading }: UserDetailProps) => {
  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Retrieving User Dossier...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full">
      {/* Sticky Header */}
      <div className="sticky  z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-4 md:px-10 -mx-4 md:-mx-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest group transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to members
            </button>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white ">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xl">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{user.fullName}</h1>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">
                    {user.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#85A1D1]" /> {user.email}</div>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5 font-mono uppercase"><Hash className="w-3.5 h-3.5 text-[#85A1D1]" /> {user.id.split("-")[0].toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <ScrollArea className="w-full">
              <TabsList className="h-14 bg-transparent gap-8 px-6 md:px-10 flex justify-start items-center border-none w-max">
                {[
                  { id: "overview", label: "Overview", icon: LayoutGrid },
                  { id: "applications", label: `Applications (${user.applications?.length || 0})`, icon: ClipboardList },
                  { id: "pets", label: `Pets (${user.pets?.length || 0})`, icon: Dog },
                  { id: "financials", label: "Financials", icon: CreditCard },
                  { id: "health", label: "Health", icon: HeartPulse },
                  { id: "timeline", label: "Timeline", icon: History },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#85A1D1] data-[state=active]:bg-transparent px-0 font-bold text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all"
                  >
                    <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="min-h-[500px]">
            <TabsContent value="overview" className="mt-0 outline-none">
              <OverviewTab user={user} />
            </TabsContent>
            <TabsContent value="applications" className="mt-0 outline-none">
              <ApplicationsTab user={user} />
            </TabsContent>
            <TabsContent value="pets" className="mt-0 outline-none">
              <PetsTab user={user} />
            </TabsContent>
            <TabsContent value="financials" className="mt-0 outline-none">
              <FinancialsTab user={user} />
            </TabsContent>
            <TabsContent value="health" className="mt-0 outline-none">
              <HealthTab user={user} />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0 outline-none">
              <TimelineTab user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
