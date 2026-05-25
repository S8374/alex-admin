"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Dog, 
  ClipboardList, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { NavItem } from "./NavItem";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  handleLogout: () => Promise<void> | void;
  isLoggingOut?: boolean;
  className?: string;
}

function SidebarContent({ activeView, setActiveView, handleLogout, isLoggingOut }: SidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-none items-center gap-3 px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="shrink-0">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/logo/encore.png"
              alt="Encore Logo"
              width={152}
              height={40}
              priority
              className="h-auto w-32 sm:w-40 object-contain"
            />
          </Link>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 custom-scrollbar">
        <div className="space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeView === "overview"} 
            onClick={() => setActiveView("overview")} 
          />
          <NavItem 
            icon={Activity} 
            label="System Health" 
            active={activeView === "health"} 
            onClick={() => setActiveView("health")} 
          />
        </div>

        <div className="pt-6 pb-2 px-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Management</div>
        <div className="space-y-1">
          <NavItem 
            icon={Users} 
            label="User Management" 
            active={activeView === "users"} 
            onClick={() => setActiveView("users")} 
          />
          <NavItem 
            icon={CreditCard} 
            label="Payment Management" 
            active={activeView === "payments"} 
            onClick={() => setActiveView("payments")} 
          />
          <NavItem 
            icon={MessageSquare} 
            label="Live Chat" 
            active={activeView === "chat"} 
            onClick={() => setActiveView("chat")} 
          />
          <NavItem 
            icon={ClipboardList} 
            label="Application Management" 
            active={activeView === "applications"}
            onClick={() => setActiveView("applications")}
          />
          <NavItem 
            icon={FileSpreadsheet} 
            label="Quotes Management" 
            active={activeView === "quotes"}
            onClick={() => setActiveView("quotes")}
          />
          <NavItem 
            icon={FileText} 
            label="Questionnaires" 
            active={activeView === "questionnaires"}
            onClick={() => setActiveView("questionnaires")}
          />
        </div>
      </nav>

      <div className="flex-none border-t border-gray-100 p-3 sm:p-4">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ activeView, setActiveView, handleLogout, isLoggingOut, className }: SidebarProps) {
  return (
    <aside className={`w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-dvh overflow-hidden ${className ?? ""}`}>
      <SidebarContent
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </aside>
  );
}

export function SidebarSheetContent({ activeView, setActiveView, handleLogout, isLoggingOut }: SidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white overflow-hidden">
      <SidebarContent
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}
