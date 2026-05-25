"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSendQuoteMutation, useGetApplicationByIdQuery } from "@/redux/api/quoteApi";
import { toast } from "sonner";
import { ApplicationList } from "../quotes/ApplicationList";
import { QuoteEditor } from "../quotes/QuoteEditor";

type ViewMode = "list" | "editor";

export function QuotesManagementView() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const { data: userData, isLoading, isFetching } = useGetAllUsersQuery({ search });
  const { data: detailData, isLoading: isDetailLoading } = useGetApplicationByIdQuery(selectedAppId!, { skip: !selectedAppId });
  const [sendQuote, { isLoading: isSending }] = useSendQuoteMutation();
 console.log("Users data:", userData);
  const allApps = useMemo(() => {
    return userData?.data?.flatMap((user: any) => 
      (user.applications || []).map((app: any) => ({
        ...app,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          personInfos: user.personInfos
        }
      }))
    )|| [];
  }, [userData]);

  const handleOpenEditor = (app: any) => {
    setSelectedAppId(app.id);
    setMode("editor");
  };

  const handleBack = () => {
    setMode("list");
    setSelectedAppId(null);
  };

  const handleSendQuote = async (formData: any) => {
    if (!detailData?.data) return;

    const application = detailData.data;
    const quotes = application.pets
      .filter((pet: any) => formData.selectedPetIds.includes(pet.id))
      .map((pet: any) => ({
        petId: pet.id,
        petCharge: Number(formData.petCharges[pet.id] || 0),
        agrementUrl: formData.sharedAgreementUrl || formData.petAgreements?.[pet.id] || ""
      }));

    if (quotes.length === 0) {
      toast.error("Please select at least one pet and set a charge");
      return;
    }

    try {
      await sendQuote({
        userId: application.user.id,
        applicationId: application.id,
        setupFee: Number(formData.setupFee),
        totalMonthlyCharge: quotes.reduce((acc: number, curr: any) => acc + curr.petCharge, 0),
        quotes
      }).unwrap();
      
      toast.success("Quotes sent successfully!");
      setMode("list");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send quotes");
    }
  };

  if (mode === "editor" && selectedAppId) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gray-50/50 -m-10 pt-0 px-10 pb-10">
        {isDetailLoading ? (
          <div className="h-[80vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Constructing Laboratory...</p>
          </div>
        ) : detailData?.data && (
          <QuoteEditor 
            application={detailData.data} 
            onBack={handleBack} 
            onSendQuote={handleSendQuote} 
            isSending={isSending} 
          />
        )}
      </motion.div>
    );
  }

  return (
    <ApplicationList 
      apps={allApps} 
      isLoading={isLoading} 
      isFetching={isFetching}
      search={search} 
      onSearchChange={setSearch} 
      onOpenEditor={handleOpenEditor} 
    />
  );
}
