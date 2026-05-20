import React from "react";
import { Badge } from "@/components/ui/badge";
import { Edit3, GitBranch, Trash2, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { RequirementBadge } from "./UIElements";

interface QuestionCardProps {
  idx: number;
  q: any;
  onEdit: () => void;
  onDelete: () => void;
  onAddBranch: () => void;
  onEditBranch: (nq: any) => void;
  onDeleteBranch: (id: string) => void;
}

export function QuestionCard({ idx, q, onEdit, onDelete, onAddBranch, onEditBranch, onDeleteBranch }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-[#85A1D1]/30 transition-all">
      <div className="p-6 flex items-start gap-5">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-[#85A1D1]/10 group-hover:text-[#85A1D1] transition-all">
          <span className="text-xs font-bold font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge className="bg-gray-50 text-gray-500 border-none text-[9px] font-bold uppercase group-hover:bg-[#85A1D1]/10 group-hover:text-[#85A1D1] transition-all">{q.category}</Badge>
              <p className="text-sm font-bold text-gray-900 leading-snug">{q.questionText}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onEdit} className="p-2 text-gray-400 hover:text-[#85A1D1] transition-colors"><Edit3 className="w-4 h-4" /></button>
              <button onClick={onAddBranch} className="h-8 px-3 bg-gray-50 text-gray-400 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#85A1D1] hover:text-white transition-all flex items-center gap-2 shadow-sm">
                <GitBranch className="w-3 h-3" /> Branch
              </button>
              <button onClick={onDelete} className="p-2 text-gray-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {q.isInputRequired && <RequirementBadge icon={AlertCircle} text="Input Req." color="text-amber-500" />}
            {q.isDocumentNeeded && <RequirementBadge icon={FileText} text="Doc Req." color="text-[#85A1D1]" />}
          </div>

          {q.nestedQuestions?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
              {q.nestedQuestions.map((nq: any) => (
                <NestedItem 
                  key={nq.id} 
                  nq={nq} 
                  onEdit={() => onEditBranch(nq)} 
                  onDelete={() => onDeleteBranch(nq.id)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NestedItemProps {
  nq: any;
  onEdit: () => void;
  onDelete: () => void;
}

function NestedItem({ nq, onEdit, onDelete }: NestedItemProps) {
  return (
    <div className="flex items-start justify-between pl-4 border-l-2 border-[#85A1D1]/20 py-1 group/nested">
      <div className="flex items-start gap-3">
        <ChevronRight className="w-3 h-3 text-[#85A1D1] mt-1" />
        <div>
          <p className="text-[11px] font-bold text-gray-600">If Yes: <span className="text-gray-900">{nq.questionText}</span></p>
          <span className="text-[9px] font-black text-[#85A1D1] uppercase tracking-tighter">Label: {nq.inputLabelText}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover/nested:opacity-100 transition-all">
        <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-[#85A1D1] transition-colors"><Edit3 className="w-3 h-3" /></button>
        <button onClick={onDelete} className="p-1.5 text-gray-200 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  );
}
