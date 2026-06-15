"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Dog, 
  Inbox, 
  Calculator, 
  ListChecks, 
  ShieldCheck, 
  Settings, 
  LogOut,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavItem } from "./NavItem";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  handleLogout: () => Promise<void> | void;
  isLoggingOut?: boolean;
  className?: string;
}

interface SidebarContentProps extends SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidebarContent({ activeView, setActiveView, handleLogout, isLoggingOut, isCollapsed = false, onToggleCollapse }: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`flex flex-none items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 pt-5 sm:px-6 sm:pt-6 h-[88px]`}>
        {!isCollapsed && (
          <div className="shrink-0 overflow-hidden">
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
        )}
        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse} 
            className="p-2 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      <nav className={`min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 custom-scrollbar ${isCollapsed ? 'px-2' : 'px-3 sm:px-4'}`}>
        <div className="space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeView === "overview"} 
            onClick={() => setActiveView("overview")} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={Activity} 
            label="System Health" 
            active={activeView === "health"} 
            onClick={() => setActiveView("health")} 
            isCollapsed={isCollapsed}
          />
        </div>

        <div className={`pt-6 pb-2 ${isCollapsed ? 'px-2 text-center' : 'px-4'} text-[11px] font-black text-gray-500 uppercase tracking-widest`}>
          {isCollapsed ? "..." : "Management"}
        </div>
        <div className="space-y-1">
          <NavItem 
            icon={Users} 
            label="User Management" 
            active={activeView === "users"} 
            onClick={() => setActiveView("users")} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={CreditCard} 
            label="Payment Management" 
            active={activeView === "payments"} 
            onClick={() => setActiveView("payments")} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={MessageSquare} 
            label="Live Chat" 
            active={activeView === "chat"} 
            onClick={() => setActiveView("chat")} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={Inbox} 
            label="Application Management" 
            active={activeView === "applications"}
            onClick={() => setActiveView("applications")}
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={Calculator} 
            label="Quotes Management" 
            active={activeView === "quotes"}
            onClick={() => setActiveView("quotes")}
            isCollapsed={isCollapsed}
          />
          <NavItem 
            icon={ListChecks} 
            label="Questionnaires" 
            active={activeView === "questionnaires"}
            onClick={() => setActiveView("questionnaires")}
            isCollapsed={isCollapsed}
          />
        </div>
      </nav>

      <div className={`flex-none border-t border-gray-100 p-3 sm:p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'w-full'}`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ activeView, setActiveView, handleLogout, isLoggingOut, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-100 flex flex-col sticky top-0 h-dvh overflow-hidden transition-all duration-300 ${className ?? ""}`}>
      <SidebarContent
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
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
