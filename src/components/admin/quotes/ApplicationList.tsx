"use client";

import React from "react";
import { Search, FileSpreadsheet, Dog, ArrowRight } from "lucide-react";
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
  onOpenEditor: (app: any) => void;
}

export const ApplicationList = ({ 
  apps, 
  isLoading, 
  search, 
  onSearchChange, 
  onOpenEditor 
}: ApplicationListProps) => {
  return (
    <div className="space-y-6">
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
            className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900 shadow-sm"
          />
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
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5} className="px-6 py-6 h-16 bg-gray-50/10" />
                  </TableRow>
                ))
              ) : apps.length ? (
                apps.map((app: any) => (
                  <TableRow key={app.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-lg border border-white shadow-sm">
                          <AvatarImage src={app.user.avatarUrl} />
                          <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xs">
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
