"use client";

import { Menu, Search, RefreshCcw, Bell } from "lucide-react";

interface HeaderProps {
  refetch: () => void;
  isFetching: boolean;
  onMenuClick?: () => void;
}

export function Header({ refetch, isFetching, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-4 lg:py-0 lg:h-20 shrink-0 shadow-sm">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden md:block w-full max-w-md xl:max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search across the system..." 
            className="w-full h-11 bg-gray-50 border-none rounded-xl pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#85A1D1]/10 transition-all text-gray-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
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
        <div className="hidden sm:flex items-center gap-3 pl-4 lg:pl-6 border-l border-gray-100">
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
