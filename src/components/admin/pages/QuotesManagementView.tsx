"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSendQuoteMutation, useGetApplicationByIdQuery, useUpdateApplicationStatusMutation } from "@/redux/api/quoteApi";
import { toast } from "sonner";
import { ApplicationList } from "../quotes/ApplicationList";
import { QuoteEditor } from "../quotes/QuoteEditor";

type ViewMode = "list" | "editor";

export function QuotesManagementView() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const authUser = useSelector((state: any) => state.auth.user);
  const { data: userData, isLoading, isFetching } = useGetAllUsersQuery({ search, limit: 99999 });
  const { data: detailData, isLoading: isDetailLoading } = useGetApplicationByIdQuery(selectedAppId!, { skip: !selectedAppId });
  const [sendQuote, { isLoading: isSending }] = useSendQuoteMutation();
  const [updateApplicationStatus, { isLoading: isApproving }] = useUpdateApplicationStatusMutation();

  const handleApproveApplication = async () => {
    if (!selectedAppId) return;
    try {
      await updateApplicationStatus({ id: selectedAppId, status: "APPROVED" }).unwrap();
      toast.success("Application approved successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve application");
    }
  };

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
    const transportFee = Number(formData.transportFee ?? 50);
    const spayNeuterFee = Number(formData.spayNeuterFee ?? 150);
    const dueDay = Number(formData.dueDay ?? 1);
    const lateFee = Number(formData.lateFee ?? 25);
    const repSig = formData.representativeSignatureUrl || "";
    
    let adminName = "";
    if (repSig) {
      if (repSig.startsWith("TYPED:")) {
        adminName = repSig.substring(6);
      } else {
        adminName = authUser?.fullName || "";
      }
    }

    let generatedUrl = `AUTO_GENERATED?transportFee=${transportFee}&spayNeuterFee=${spayNeuterFee}&dueDay=${dueDay}&lateFee=${lateFee}`;
    if (repSig) {
      generatedUrl += `&representativeSignatureUrl=${encodeURIComponent(repSig)}`;
    }
    if (adminName) {
      generatedUrl += `&adminName=${encodeURIComponent(adminName)}`;
    }

    const quotes = application.pets
      .filter((pet: any) => formData.selectedPetIds.includes(pet.id))
      .map((pet: any) => ({
        petId: pet.id,
        petCharge: Number(formData.petCharges[pet.id] || 0),
        agrementUrl: formData.sharedAgreementUrl?.trim() || generatedUrl
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
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Constructing Laboratory...</p>
          </div>
        ) : detailData?.data && (
          <QuoteEditor 
            application={detailData.data} 
            onBack={handleBack} 
            onSendQuote={handleSendQuote} 
            isSending={isSending} 
            onApproveApplication={handleApproveApplication}
            isApprovingApplication={isApproving}
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
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onOpenEditor={handleOpenEditor} 
    />
  );
}
