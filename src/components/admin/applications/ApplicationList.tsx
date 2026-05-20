"use client";

import React from "react";
import { Search, ClipboardList, Eye, CheckCircle2, XCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ApplicationListProps {
  apps: any[];
  isLoading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onOpenDetail: (app: any) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApplicationList = ({ 
  apps, 
  isLoading, 
  search, 
  onSearchChange,
  statusFilter,
  onStatusFilterChange, 
  onOpenDetail,
  onApprove,
  onReject
}: ApplicationListProps) => {

  const filteredApps = apps.filter((app: any) => {
    const matchesSearch = app.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Application Management</h1>
          <p className="text-gray-500 text-sm font-medium">Review and process user plan applications</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-10 px-4 w-full sm:w-48 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all shadow-sm"
          >
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
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5} className="px-6 py-6 h-16 bg-gray-50/10" />
                  </TableRow>
                ))
              ) : filteredApps.length ? (
                filteredApps.map((app: any) => (
                  <TableRow key={app.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-lg border border-white shadow-sm">
                          <AvatarImage src={app.user?.avatarUrl} />
                          <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xs">
                            {app.user?.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none mb-1">{app.user?.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{app.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {getStatusBadge(app.status)}
                    </TableCell>
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
                            <Button 
                              onClick={() => onApprove(app.id)} 
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                              title="Approve Application"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => onReject(app.id)} 
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        ) : null}
                        <Button 
                          onClick={() => onOpenDetail(app)} 
                          variant="secondary"
                          className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-20 text-center text-gray-300">
                    <p className="text-sm font-medium">No applications found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
