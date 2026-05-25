import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Edit3, Trash2 } from "lucide-react";

export function QuestionnaireHero({ data, onEdit, onDelete }: any) {
  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl">
      <Activity className="absolute -right-5 -bottom-5 w-48 h-48 text-white/5 rotate-12" />
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-[#85A1D1] text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">Active Template</Badge>
          <div className="flex items-center gap-2 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
            <button onClick={onEdit} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"><Edit3 className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-tight mb-2">{data.topicTitle}</h2>
          <p className="text-sm text-white/60 font-medium max-w-xl italic">"{data.description}"</p>
        </div>
      </div>
    </div>
  );
}
