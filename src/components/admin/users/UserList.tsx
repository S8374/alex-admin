"use client";

import React from "react";
import { Search, Shield, Mail, Calendar, UserCheck, UserMinus, Trash2, MoreVertical, Users, ArrowRight } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserListProps {
  users: any[];
  isLoading: boolean;
  params: any;
  setParams: (p: any) => void;
  onViewProfile: (id: string) => void;
  onStatusToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const UserList = ({ 
  users, 
  isLoading, 
  params, 
  setParams, 
  onViewProfile, 
  onStatusToggle, 
  onDelete 
}: UserListProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "PENDING_VERIFICATION": return "secondary";
      case "SUSPENDED": return "destructive";
      case "INACTIVE": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm font-medium">Review and manage platform user accounts</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={params.search}
              onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
              className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900 shadow-sm"
            />
          </div>
          <select
            value={params.role}
            onChange={(e) => setParams({ ...params, role: e.target.value, page: 1 })}
            className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-transparent">
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest">User Dossier</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Role</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Joined</TableHead>
                <TableHead className="px-6 h-12 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell colSpan={5} className="px-6 py-4 h-16 bg-gray-50/10" />
                  </TableRow>
                ))
              ) : users.length ? (
                users.map((user: any) => (
                  <TableRow key={user.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-lg border border-white shadow-sm">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] font-bold text-xs">
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                        <Shield className="w-3 h-3 mr-1.5 opacity-70" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant={getStatusVariant(user.status)} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                        {user.status === 'PENDING_VERIFICATION' ? 'Pending' : user.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button 
                        onClick={() => onViewProfile(user.id)} 
                        variant="secondary"
                        className="h-8 px-4 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hidden sm:flex items-center gap-1.5"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 text-gray-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-gray-100">
                          <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Management</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onStatusToggle(user.id, user.status)}
                            className="rounded-lg cursor-pointer font-bold text-xs gap-3 focus:bg-[#85A1D1]/5 focus:text-[#85A1D1]"
                          >
                            {user.status === 'ACTIVE' ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            {user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-gray-50" />
                          <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="rounded-lg cursor-pointer font-bold text-xs gap-3 text-red-500 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-20 text-center text-gray-300">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 opacity-10" />
                      <p className="text-sm font-medium">No users match your criteria</p>
                    </div>
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
