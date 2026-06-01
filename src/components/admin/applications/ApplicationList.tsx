"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, CheckCircle2, XCircle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "../questionnaire/UIElements";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ApplicationListProps {
  apps: any[];
  isLoading: boolean;
  isFetching?: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onOpenDetail: (app: any) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function MobileApplicationCard({ app, getStatusBadge, onApprove, onReject, onOpenDetail }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white rounded-md border border-gray-50 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-3 p-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white shadow-sm shrink-0">
            <AvatarImage src={app.user?.avatarUrl} />
            <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xs">{app.user?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{app.user?.fullName}</p>
            <p className="text-[11px] text-gray-400 font-medium truncate wrap-break-word">{app.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="whitespace-nowrap">{getStatusBadge(app.status)}</div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="text-[12px] text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</div>
          <div className="flex items-center gap-2">
            {app.status === "SUBMITTED" || app.status === "UNDER_REVIEW" ? (
              <>
                <Button onClick={() => onApprove(app.id)} variant="ghost" className="h-8 w-8 p-0 rounded-md text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button onClick={() => onReject(app.id)} variant="ghost" className="h-8 w-8 p-0 rounded-md text-rose-600">
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            ) : null}
            <Button onClick={() => onOpenDetail(app)} variant="secondary" className="h-8 px-3 rounded-md text-[10px] font-bold">
              <Eye className="w-3.5 h-3.5 mr-1" /> View
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ApplicationList = ({
  apps,
  isLoading,
  isFetching = false,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenDetail,
  onApprove,
  onReject,
}: ApplicationListProps) => {
  const loading = isLoading || isFetching;
  const hasActiveFilters = Boolean(search.trim()) || statusFilter !== "ALL";

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredApps = apps.filter((app: any) => {
    const matchesSearch = app.user?.fullName?.toLowerCase().includes(search.toLowerCase()) || app.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, apps]);

  const total = filteredApps.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(total, startIndex + pageSize);
  const paginatedApps = filteredApps.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[10px] uppercase">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-50 text-rose-600 border border-rose-100 font-bold text-[10px] uppercase">Rejected</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[10px] uppercase">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[10px] uppercase">Under Review</Badge>;
      case "QUOTE_READY":
        return <Badge className="bg-purple-50 text-purple-600 border border-purple-100 font-bold text-[10px] uppercase">Quote Ready</Badge>;
      case "DRAFT":
      case "IN_PROGRESS":
        return <Badge className="bg-gray-50 text-gray-500 border border-gray-200 font-bold text-[10px] uppercase">Draft</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-500 border border-gray-200 font-bold text-[10px] uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Application Management</h1>
          <p className="text-gray-500 text-sm font-medium">Review and process user plan applications</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Status Filter */}
          <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="h-10 px-4 w-full sm:w-48 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all shadow-sm">
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="QUOTE_READY">Quote Ready</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900 shadow-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Mobile accordion */}
        <div className="block lg:hidden p-4 flex-1">
          {loading ? (
            <LoadingState />
          ) : filteredApps.length ? (
            <div className="space-y-3">
              {filteredApps.map((app: any) => (
                <MobileApplicationCard key={app.id} app={app} getStatusBadge={getStatusBadge} onApprove={onApprove} onReject={onReject} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <NoApplicationDataState
                hasFilters={hasActiveFilters}
                onClearFilters={() => {
                  onSearchChange("");
                  onStatusFilterChange("ALL");
                }}
              />
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:flex overflow-x-auto flex-1 flex-col">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-transparent">
                  <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest">Applicant</TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Pets</TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Date</TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-6">
            {loading ? (
              <LoadingState />
            ) : paginatedApps.length ? (
              <div className="w-full">
                <Table>
                  <TableBody>
                    {paginatedApps.map((app: any) => (
                      <TableRow key={app.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-lg border border-white shadow-sm">
                              <AvatarImage src={app.user?.avatarUrl} />
                              <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xs">{app.user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-none mb-1">{app.user?.fullName}</p>
                              <p className="text-[11px] text-gray-400 font-medium">{app.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-gray-700">{app._count?.pets || app.pets?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.status === "SUBMITTED" || app.status === "UNDER_REVIEW" ? (
                              <>
                                <Button onClick={() => onApprove(app.id)} variant="ghost" className="h-8 w-8 p-0 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all" title="Approve Application">
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button onClick={() => onReject(app.id)} variant="ghost" className="h-8 w-8 p-0 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all" title="Reject Application">
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            ) : null}
                            <Button onClick={() => onOpenDetail(app)} variant="secondary" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                              <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <NoApplicationDataState
                  hasFilters={hasActiveFilters}
                  onClearFilters={() => {
                    onSearchChange("");
                    onStatusFilterChange("ALL");
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{endIndex}</span> of <span className="font-bold text-gray-900">{total}</span> applications
          </div>

          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-9 px-3 border border-gray-200 rounded-md bg-white text-sm outline-none">
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <div className="flex items-center gap-1">
              <Button variant="ghost" className="h-9 w-9 p-0" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-3 text-sm">
                Page <span className="font-bold">{page}</span> / {totalPages}
              </div>
              <Button variant="ghost" className="h-9 w-9 p-0" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function NoApplicationDataState({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-dashed border-gray-200 bg-linear-to-br from-white to-gray-50 p-8 sm:p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-200">
        <Eye className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">
        {hasFilters ? "No matching applications" : "No applications available"}
      </h3>
      <p className="text-sm text-gray-500 leading-6 max-w-md mx-auto">
        {hasFilters
          ? "Try clearing your search or status filter to see more applications."
          : "There are no applications to review yet."}
      </p>
      {hasFilters && (
        <div className="mt-6">
          <button
            onClick={onClearFilters}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
 
