import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Shield } from "lucide-react";
import { DrawerHeaderProps } from "./types";

export function DrawerHeader({ user }: DrawerHeaderProps) {
  return (
    <div className="p-6 sm:p-10 bg-white border-b border-gray-100 shrink-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
        <Avatar className="w-20 h-20 rounded-[2.5rem] border-4 border-white shadow-2xl ring-1 ring-gray-100">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="bg-[#85A1D1]/10 text-[#85A1D1] text-4xl sm:text-5xl font-black">
            {user.fullName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-4 sm:space-y-6 flex-1 pt-2">
          <div>
            <h2 className="text-3xl sm:text-xl font-black text-gray-900 tracking-tight mb-2 sm:mb-3">{user.fullName}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-gray-600 font-bold text-xs sm:text-sm">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#85A1D1]" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-bold text-xs sm:text-sm">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#85A1D1]" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-xl font-black text-[10px] sm:text-[11px] tracking-tight px-4 py-2 shadow-sm">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 opacity-70" />
              {user.role}
            </Badge>
            <Badge className={`rounded-xl font-black text-[10px] sm:text-[11px] tracking-tight px-4 py-2 shadow-sm border ${
              user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              user.status === 'SUSPENDED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2.5 ${
                user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                user.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              {user.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
