"use client";

import Image from "next/image";
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
  handleLogout: () => void;
}

export function Sidebar({ activeView, setActiveView, handleLogout }: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/encore.png"
            alt="Encore Logo"
            width={120}
            height={34}
            priority
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
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
            icon={ShieldCheck} 
            label="Agreements" 
            active={activeView === "agreements"}
            onClick={() => setActiveView("agreements")}
          />
          <NavItem 
            icon={FileText} 
            label="Questionnaires" 
            active={activeView === "questionnaires"}
            onClick={() => setActiveView("questionnaires")}
          />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
