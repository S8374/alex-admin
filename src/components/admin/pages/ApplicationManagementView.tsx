"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  useGetAllApplicationsQuery, 
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation 
} from "@/redux/api/quoteApi";
import { toast } from "sonner";
import { ApplicationList } from "../applications/ApplicationList";
import { ApplicationDetail } from "../applications/ApplicationDetail";

type ViewMode = "list" | "detail";

interface ApplicationManagementViewProps {
  setActiveView?: (view: any) => void;
}

export function ApplicationManagementView({ setActiveView }: ApplicationManagementViewProps = {}) {
  const [mode, setMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const { data: appsData, isLoading } = useGetAllApplicationsQuery(undefined);
  const { data: detailData, isLoading: isDetailLoading } = useGetApplicationByIdQuery(selectedAppId!, { skip: !selectedAppId });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  const allApps = appsData?.data || [];

  const handleOpenDetail = (app: any) => {
    setSelectedAppId(app.id);
    setMode("detail");
  };

  const handleBack = () => {
    setMode("list");
    setSelectedAppId(null);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedAppId) return;
    try {
      await updateStatus({ id: selectedAppId, status }).unwrap();
      toast.success(`Application status updated to ${status}`);
      // Return to list or stay in detail
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update application status");
    }
  };

  const handleApproveFromList = async (id: string) => {
    try {
      await updateStatus({ id, status: "APPROVED" }).unwrap();
      toast.success("Application approved successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to approve application");
    }
  };

  const handleRejectFromList = async (id: string) => {
    try {
      await updateStatus({ id, status: "REJECTED" }).unwrap();
      toast.success("Application rejected successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reject application");
    }
  };

  if (mode === "detail" && selectedAppId) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="min-h-screen bg-gray-50/50 -m-10 pt-0 px-10 pb-10"
      >
        <ApplicationDetail 
          application={detailData?.data}
          onBack={handleBack}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={isUpdating}
          isLoading={isDetailLoading}
          onPrepareQuote={() => setActiveView?.("quotes")}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <ApplicationList 
        apps={allApps}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenDetail={handleOpenDetail}
        onApprove={handleApproveFromList}
        onReject={handleRejectFromList}
      />
    </motion.div>
  );
}
