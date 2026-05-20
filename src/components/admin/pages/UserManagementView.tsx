"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery
} from "@/redux/api/userApi";
import { toast } from "sonner";
import { UserList } from "../users/UserList";
import { UserDetail } from "../users/UserDetail";

type ViewMode = "list" | "detail";

export function UserManagementView() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [params, setParams] = useState({ page: 1, limit: 10, search: "", role: "", status: "" });

  const { data: userData, isLoading, isFetching } = useGetAllUsersQuery(params);
  const { data: detailResponse, isLoading: isDetailLoading } = useGetUserByIdQuery(selectedUserId!, { skip: !selectedUserId });

  const [toggleStatus] = useToggleUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  console.log("userData", userData);
  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await toggleStatus({ id, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleViewProfile = (id: string) => {
    setSelectedUserId(id);
    setMode("detail");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleBack = () => {
    setMode("list");
    setSelectedUserId(null);
  };

  if (mode === "detail" && selectedUserId) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gray-50/50 -m-10 pt-0 px-10 pb-10">
        <UserDetail
          user={detailResponse?.data}
          onBack={handleBack}
          isLoading={isDetailLoading}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <UserList
        users={userData?.data || []}
        isLoading={isLoading}
        params={params}
        setParams={setParams}
        onViewProfile={handleViewProfile}
        onStatusToggle={handleStatusToggle}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {!isLoading && userData?.meta?.pagination && (
        <div className="px-8 py-5 border-t border-gray-100 bg-white rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Showing {((params.page - 1) * params.limit) + 1} to {Math.min(params.page * params.limit, userData.meta.pagination.total)} of {userData.meta.pagination.total} users
          </span>
          <div className="flex gap-2">
            <button
              disabled={params.page === 1}
              onClick={() => setParams({ ...params, page: params.page - 1 })}
              className="h-9 px-4 rounded-lg bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
            >
              Prev
            </button>
            <button
              disabled={params.page === userData.meta.pagination.totalPages}
              onClick={() => setParams({ ...params, page: params.page + 1 })}
              className="h-9 px-4 rounded-lg bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
