import React from "react";
import { ClipboardList, Plus } from "lucide-react";

export function ManagementHeader({ hasQuestionnaire, onInit, onAdd }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 sm:px-6 py-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight wrap-break-word">Health Questionnaire</h1>
          <p className="text-[10px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider wrap-break-word">Assessment Logic Builder</p>
        </div>
      </div>
      <div className="flex items-stretch sm:items-center gap-3 w-full sm:w-auto">
        {!hasQuestionnaire ? (
          <button onClick={onInit} className="h-10 w-full sm:w-auto px-4 bg-primary text-white rounded-lg font-bold text-xs hover:bg-[#7490c0] transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Initialize Framework
          </button>
        ) : (
          <button onClick={onAdd} className="h-10 w-full sm:w-auto px-4 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        )}
      </div>
    </div>
  );
}
