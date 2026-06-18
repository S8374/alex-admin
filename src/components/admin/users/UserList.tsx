"use client";

import React from "react";
import { Search, Shield, UserCheck, UserMinus, UserX, Clock, Trash2, MoreVertical, Users, ArrowRight, CreditCard } from "lucide-react";
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
  stats?: any;
  isLoading: boolean;
  isFetching?: boolean;
  params: any;
  setParams: (p: any) => void;
  onViewProfile: (id: string) => void;
  onStatusToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const UserList = ({
  users,
  stats,
  isLoading,
  isFetching,
  params,
  setParams,
  onViewProfile,
  onStatusToggle,
  onDelete,
}: UserListProps) => {
  const isBusy = isLoading || !!isFetching;
  const hasActiveFilters = Boolean(params.search?.trim()) || Boolean(params.role);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PENDING_VERIFICATION":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      case "INACTIVE":
        return "outline";
      default:
        return "secondary";
    }
  };

  const LoadingPanel = () => (
    <div className="p-5 sm:p-8">
      <div className="rounded-3xl border border-gray-100 bg-linear-to-br from-white to-gray-50/80 shadow-sm p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full bg-gray-200" />
            <div className="h-3 w-64 rounded-full bg-gray-200" />
          </div>
          <div className="h-10 w-44 rounded-xl bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-2xl bg-gray-100" />
        </div>

        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-4 sm:p-5 space-y-3">
          <div className="h-3 w-24 rounded-full bg-gray-200" />
          <div className="h-3 w-full rounded-full bg-gray-200" />
          <div className="h-3 w-5/6 rounded-full bg-gray-200" />
          <div className="h-3 w-3/5 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <div className="p-1.5 bg-gray-50 rounded-lg"><Users className="w-4 h-4 text-gray-600" /></div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers ?? users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <div className="p-1.5 bg-emerald-50 rounded-lg"><UserCheck className="w-4 h-4 text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats?.activeUsers ?? users.filter((u: any) => u.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <div className="p-1.5 bg-amber-50 rounded-lg"><Clock className="w-4 h-4 text-amber-500" /></div>
          </div>
          <p className="text-2xl font-bold text-amber-500">{stats?.pendingUsers ?? users.filter((u: any) => u.status === 'PENDING_VERIFICATION').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500">Suspended</p>
            <div className="p-1.5 bg-red-50 rounded-lg"><UserX className="w-4 h-4 text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats?.suspendedUsers ?? users.filter((u: any) => u.status === 'SUSPENDED').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-500">Paid Users</p>
            <div className="p-1.5 bg-blue-50 rounded-lg"><CreditCard className="w-4 h-4 text-blue-600" /></div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats?.paidUsers ?? 0}</p>
        </div>
      </div>

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
              className="h-10 w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all text-gray-900 shadow-sm"
            />
          </div>
          <select
            value={params.status || ""}
            onChange={(e) => setParams({ ...params, status: e.target.value, page: 1 })}
            className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select
            value={params.paidOnly || ""}
            onChange={(e) => setParams({ ...params, paidOnly: e.target.value, page: 1 })}
            className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">All Users</option>
            <option value="true">Paid Users Only</option>
          </select>

        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        {isBusy ? (
          <LoadingPanel />
        ) : (
          <>
            <div className="md:hidden p-4 space-y-3 flex-1">
              {users.length ? (
                users.map((user: any) => (
                  <div key={user.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-11 h-11 rounded-xl border border-white shadow-sm shrink-0">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-medium truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => onViewProfile(user.id)}
                        variant="secondary"
                        className="h-8 px-3 rounded-lg text-[11px] font-bold uppercase tracking-widest"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                        <Shield className="w-3 h-3 mr-1.5 opacity-70" />
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusVariant(user.status)} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                        {user.status === "PENDING_VERIFICATION" ? "Pending" : user.status.replace("_", " ")}
                      </Badge>
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
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
                            className="rounded-lg cursor-pointer font-bold text-xs gap-3 focus:bg-primary/5 focus:text-primary"
                          >
                            {user.status === "ACTIVE" ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            {user.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
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
                    </div>
                  </div>
                ))
              ) : (
                <NoUserDataState
                  hasFilters={hasActiveFilters}
                  onClearFilters={() => setParams({ ...params, search: "", role: "", page: 1 })}
                />
              )}
            </div>

            <div className="hidden md:block overflow-x-auto flex-1">
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
                  {users.length ? (
                    users.map((user: any) => (
                      <TableRow key={user.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50/60">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-lg border border-white shadow-sm">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
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
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                            <Shield className="w-3 h-3 mr-1.5 opacity-70" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <Badge variant={getStatusVariant(user.status)} className="rounded-md font-bold text-[10px] uppercase px-2 py-0.5">
                            {user.status === "PENDING_VERIFICATION" ? "Pending" : user.status.replace("_", " ")}
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
                                className="rounded-lg cursor-pointer font-bold text-xs gap-3 focus:bg-primary/5 focus:text-primary"
                              >
                                {user.status === "ACTIVE" ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                {user.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 bg-gray-50" />
                              {user.payments?.length > 0 ? (
                                <DropdownMenuItem
                                  disabled
                                  className="rounded-lg font-bold text-xs gap-3 text-gray-400 cursor-not-allowed"
                                  title="Cannot delete users with completed payments"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete User (Paid)
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => onDelete(user.id)}
                                  className="rounded-lg cursor-pointer font-bold text-xs gap-3 text-red-500 focus:bg-red-50 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-20 text-center text-gray-300">
                        <NoUserDataState
                          hasFilters={hasActiveFilters}
                          onClearFilters={() => setParams({ ...params, search: "", role: "", page: 1 })}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function NoUserDataState({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  return (
    <div className="w-full min-h-96 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full rounded-3xl border border-dashed border-gray-200 bg-linear-to-br from-white to-gray-50 p-8 sm:p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-200">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          {hasFilters ? "No matching users" : "No users available"}
        </h3>
        <p className="text-sm text-gray-500 leading-6 max-w-md mx-auto">
          {hasFilters
            ? "Try clearing your search or role filter to see more users."
            : "There are no user records to display yet."}
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
    </div>
  );
}
