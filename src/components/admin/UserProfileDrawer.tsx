"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { UserProfileDrawerProps } from "./user-profile-drawer/types";
import { DrawerHeader } from "./user-profile-drawer/DrawerHeader";
import { OverviewTab } from "./user-profile-drawer/OverviewTab";
import { ApplicationsTab } from "./user-profile-drawer/ApplicationsTab";
import { PetsTab } from "./user-profile-drawer/PetsTab";
import { FinancialsTab } from "./user-profile-drawer/FinancialsTab";
import { HealthTab } from "./user-profile-drawer/HealthTab";
import { RepresentativeTab } from "./user-profile-drawer/RepresentativeTab";

export function UserProfileDrawer({ userId, isOpen, onClose }: UserProfileDrawerProps) {
  const { data: userResponse, isLoading } = useGetUserByIdQuery(userId, { skip: !userId });
  const user = userResponse?.data;
  console.log("user", user);
  if (!userId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[95vw] sm:w-150 lg:w-212.5 max-w-none p-0 border-l border-gray-100 flex flex-col h-full gap-0 overflow-hidden shadow-2xl bg-white">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : user ? (
          <>
            {/* Header / Profile Summary */}
            <DrawerHeader user={user} />

            {/* Navigation Tabs */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-gray-100 shrink-0 sticky top-0 bg-white z-20">
                <ScrollArea className="w-full">
                  <TabsList className="h-16 bg-transparent gap-0 px-6 sm:px-10 flex justify-start items-center border-none outline-none w-max">
                    <TabsTrigger value="overview" className="h-full rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 sm:px-6 font-black text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="applications" className="h-full rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 sm:px-6 font-black text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 data-[state=active]:shadow-sm">Applications ({user.applications?.length || 0})</TabsTrigger>
                    <TabsTrigger value="pets" className="h-full rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 sm:px-6 font-black text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 data-[state=active]:shadow-sm">Pets ({user.pets?.length || 0})</TabsTrigger>
                    <TabsTrigger value="financials" className="h-full rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 sm:px-6 font-black text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 data-[state=active]:shadow-sm">Financials</TabsTrigger>
                    <TabsTrigger value="health" className="h-full rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-4 sm:px-6 font-black text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all shrink-0 hover:bg-gray-50 data-[state=active]:shadow-sm">Health</TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50/10">
                <div className="p-6 sm:p-10 pb-16">
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
              </div>
            </Tabs>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              <User className="w-10 h-10 text-gray-200" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-gray-900 tracking-tight">Error Loading Profile</p>
              <p className="text-sm font-medium text-gray-500 max-w-75">We couldn't retrieve the full profile data at this time.</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
