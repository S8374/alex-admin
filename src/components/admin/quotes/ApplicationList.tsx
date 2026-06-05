"use client";

import React, { useState, useEffect } from "react";
import { Search, FileSpreadsheet, Dog, ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
  isFetching?: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenEditor: (app: any) => void;
}

export const ApplicationList = ({ 
  apps, 
  isLoading, 
  isFetching = false,
  search, 
  onSearchChange, 
  onOpenEditor 
}: ApplicationListProps) => {
  const loading = isLoading || isFetching;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [search, apps]);

  const filtered = apps.filter((app: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (app.user?.fullName || "").toLowerCase().includes(q) || (app.user?.email || "").toLowerCase().includes(q);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(total, startIndex + pageSize);
  const paginated = filtered.slice(startIndex, endIndex);
  return (
    <div className="min-h-screen flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Quotes Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage and process user applications</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all text-gray-900 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col grow">
        {/* Mobile */}
        <div className="block lg:hidden p-4 flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginated.length ? (
            <div className="space-y-3">
              {paginated.map((app: any) => (
                <MobileQuoteCard key={app.id} app={app} onOpenEditor={onOpenEditor} />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              <p className="text-sm font-medium">No applications found</p>
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-transparent">
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest">Applicant</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Pets</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Date</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-0">
                    <div className="min-h-[40vh] flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginated.length ? (
                paginated.map((app: any) => (
                  <TableRow key={app.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-lg border border-white shadow-sm">
                          <AvatarImage src={app.user.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {app.user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none mb-1">{app.user.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{app.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`rounded-md font-bold text-[10px] uppercase px-2 py-0.5 ${
                        app.status === 'QUOTE_READY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        app.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {app.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-700">{app.pets?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button 
                        onClick={() => onOpenEditor(app)} 
                        variant="secondary"
                        className="h-8 px-4 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-0">
                    <div className="min-h-[40vh] flex items-center justify-center text-gray-300">
                      <p className="text-sm font-medium">No applications found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{endIndex}</span> of <span className="font-bold text-gray-900">{total}</span> quotes
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

  function MobileQuoteCard({ app, onOpenEditor }: any) {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-full bg-white rounded-md border border-gray-50 shadow-sm overflow-hidden">
        <button type="button" onClick={() => setOpen((s) => !s)} className="w-full flex items-center justify-between gap-3 p-3 text-left">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 rounded-lg border border-white shadow-sm shrink-0">
              <AvatarImage src={app.user?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{app.user?.fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{app.user?.fullName}</p>
              <p className="text-[11px] text-gray-400 font-medium truncate">{app.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">{app.status?.replace("_", " ")}</Badge>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
          </div>
        </button>

        {open && (
          <div className="px-3 pb-3 pt-0 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="text-[12px] text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-2">
              <Button onClick={() => onOpenEditor(app)} variant="secondary" className="h-8 px-3 rounded-md text-[10px] font-bold">Details</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
