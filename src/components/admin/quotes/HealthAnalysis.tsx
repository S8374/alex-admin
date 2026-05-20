"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthAnalysisProps {
  answers: any[];
}

export const HealthAnalysis = ({ answers }: HealthAnalysisProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="space-y-6"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Medical Analysis</h3>
        <p className="text-xs text-gray-400 mt-1">Reviewing questionnaire responses</p>
      </div>
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 font-bold text-xs px-3">
        {answers.filter((a: any) => a.answerBoolean).length} Flagged
      </Badge>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {answers.map((ans: any) => (
        <div key={ans.id} className={`p-6 rounded-xl border transition-all ${
          ans.answerBoolean ? 'bg-red-50/20 border-red-100' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#85A1D1] uppercase tracking-widest">{ans.question?.category || "General"}</span>
              <p className="text-base font-bold text-gray-900 leading-snug">
                {ans.question?.questionText || ans.nestedQuestion?.questionText}
              </p>
            </div>
            <div className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
              ans.answerBoolean ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {ans.answerBoolean ? "Yes" : "No"}
            </div>
          </div>
          {ans.inputValue && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-3 items-start border border-gray-100">
              <Info className="w-4 h-4 text-[#85A1D1] mt-0.5" />
              <p className="text-sm text-gray-600 italic">"{ans.inputValue}"</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </motion.div>
);
