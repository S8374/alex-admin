import React from "react";
import { HelpCircle, GitBranch, ShieldCheck } from "lucide-react";

export function LogicStats({ questions }: { questions: any[] }) {
  const branchCount = questions.reduce((acc, q) => acc + (q.nestedQuestions?.length || 0), 0);
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logic Statistics</h3>
      <div className="space-y-4">
        <StatItem icon={HelpCircle} label="Root Questions" value={questions.length} color="text-gray-400" />
        <StatItem icon={GitBranch} label="Logic Branches" value={branchCount} color="text-primary" />
      </div>
      <div className="bg-primary p-6 rounded-2xl text-white space-y-4">
        <ShieldCheck className="w-6 h-6 text-white/50" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest">Assessment Policy</h3>
        <p className="text-[10px] text-white/70 leading-relaxed font-medium">All edits are live. Use logic branching to capture deep medical history for accurate quotes.</p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs font-bold text-gray-500">{label}</span>
      </div>
      <span className="text-xs font-black text-gray-900">{value}</span>
    </div>
  );
}
