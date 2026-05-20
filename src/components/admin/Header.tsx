"use client";

import { Search, RefreshCcw, Bell } from "lucide-react";

interface HeaderProps {
  refetch: () => void;
  isFetching: boolean;
}

export function Header({ refetch, isFetching }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 shrink-0 shadow-sm">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search across the system..." 
          className="w-full h-11 bg-gray-50 border-none rounded-xl pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => refetch()}
          className={`p-2 text-gray-400 hover:text-[#85A1D1] transition-all ${isFetching ? 'animate-spin' : ''}`}
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-gray-400 hover:text-[#85A1D1] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Alex Garrett</p>
            <p className="text-[11px] font-bold text-[#85A1D1] uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-[#85A1D1]/10 rounded-full flex items-center justify-center font-bold text-[#85A1D1] border-2 border-white shadow-sm">
            AG
          </div>
        </div>
      </div>
    </header>
  );
}
