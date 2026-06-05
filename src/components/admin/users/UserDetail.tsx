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
  ClipboardList
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

interface UserDetailProps {
  user: any;
  onBack: () => void;
  isLoading: boolean;
}

export const UserDetail = ({ user, onBack, isLoading }: UserDetailProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="sticky z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-4 md:px-10 -mx-4 md:-mx-10 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="h-3 w-32 rounded-full bg-gray-200" />
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 rounded-full bg-gray-200" />
                <div className="h-4 w-72 max-w-full rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-3 sm:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-10 w-24 sm:w-32 rounded-xl bg-gray-200 shrink-0" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-72 rounded-2xl bg-white border border-gray-100 shadow-sm" />
            <div className="h-72 rounded-2xl bg-white border border-gray-100 shadow-sm" />
          </div>

          <div className="h-28 rounded-2xl bg-gray-900/90 shadow-sm" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full">
      {/* Sticky Header */}
      <div className="sticky z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-4 md:px-10 -mx-4 md:-mx-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest group transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to members
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white shrink-0">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight wrap-break-word">{user.fullName}</h1>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">
                    {user.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 min-w-0 wrap-break-word"><Mail className="w-4 h-4 text-primary shrink-0" /> <span className="wrap-break-word">{user.email}</span></div>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5 font-mono uppercase"><Hash className="w-3.5 h-3.5 text-primary" /> {user.id.split("-")[0].toUpperCase()}</div>
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
              <TabsList className="h-auto min-h-14 py-2 bg-transparent gap-2 sm:gap-3 px-4 sm:px-6 md:px-10 flex justify-start items-center border-none w-max">
                {[
                  { id: "overview", label: "Overview", icon: LayoutGrid },
                  { id: "applications", label: `Applications (${user.applications?.length || 0})`, icon: ClipboardList },
                  { id: "pets", label: `Pets (${user.pets?.length || 0})`, icon: Dog },
                  { id: "financials", label: "Financials", icon: CreditCard },
                  { id: "health", label: "Health", icon: HeartPulse },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="h-10 sm:h-full px-3 sm:px-4 md:px-6 rounded-xl sm:rounded-none border-b-3 sm:border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 sm:data-[state=active]:bg-primary/5 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 sm:hover:bg-gray-50 data-[state=active]:shadow-sm"
                  >
                    <tab.icon className="w-4 h-4 mr-2 hidden sm:inline-flex" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="min-h-125">
            <TabsContent value="overview" className="mt-0 outline-none">
              <OverviewTab user={user} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="applications" className="mt-0 outline-none">
              <ApplicationsTab user={user} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="pets" className="mt-0 outline-none">
              <PetsTab user={user} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="financials" className="mt-0 outline-none">
              <FinancialsTab user={user} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="health" className="mt-0 outline-none">
              <HealthTab user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
