import { motion } from "framer-motion";

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export function NavItem({ icon: Icon, label, active = false, onClick, isCollapsed = false }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center transition-all duration-300 group ${
        isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
      } rounded-xl ${
        active 
          ? "bg-[#85A1D1] text-white shadow-lg shadow-[#85A1D1]/20" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
      {!isCollapsed && (
        <>
          <span className={`text-sm font-bold tracking-tight truncate ${active ? "font-black" : ""}`}>{label}</span>
          {active && (
            <motion.div 
              layoutId="activePill"
              className="ml-auto shrink-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          )}
        </>
      )}
    </button>
  );
}
