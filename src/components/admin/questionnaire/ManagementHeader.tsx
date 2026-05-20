import React from "react";
import { ClipboardList, Plus } from "lucide-react";

export function ManagementHeader({ hasQuestionnaire, onInit, onAdd }: any) {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-none mb-1">Health Questionnaire</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assessment Logic Builder</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!hasQuestionnaire ? (
          <button onClick={onInit} className="h-9 px-4 bg-[#85A1D1] text-white rounded-lg font-bold text-xs hover:bg-[#7490c0] transition-all flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Initialize Framework
          </button>
        ) : (
          <button onClick={onAdd} className="h-9 px-4 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        )}
      </div>
    </div>
  );
}
