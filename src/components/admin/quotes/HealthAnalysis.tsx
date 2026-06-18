"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, AlertCircle, Users, FileText, CheckCircle2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthAnalysisProps {
  application: any;
}

export const HealthAnalysis = ({ application }: HealthAnalysisProps) => {
  const { healthAnswers, familyHealthHistories } = application;

  const processedHealthAnswers = (healthAnswers || []).map((answer: any) => ({
    ...answer,
    familyHistories: (familyHealthHistories || []).filter(
      (fh: any) => {
        if (answer.questionId && fh.questionId === answer.questionId) return true;
        if (answer.nestedQuestionId && fh.nestedQuestionId === answer.nestedQuestionId) return true;
        return false;
      }
    ),
  }));

  const answersWithFamily = processedHealthAnswers.filter((a: any) => a.familyHistories.length > 0);
  const answersWithoutFamily = processedHealthAnswers.filter((a: any) => a.familyHistories.length === 0);

  return (
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
        {(healthAnswers || []).filter((a: any) => a.answerBoolean).length} Flagged
      </Badge>
    </div>

    <div className="space-y-8">
      {/* Family History Answers - Priority Section */}
      {answersWithFamily.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-amber-100">
            <Users className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              With Family Health History
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {answersWithFamily.map((answer: any) => (
              <div
                key={answer.id}
                className="bg-linear-to-r from-amber-50/50 to-orange-50/30 rounded-xl border-2 border-amber-100 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Question Header */}
                <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {answer.question?.questionText || answer.nestedQuestion?.questionText}
                    </p>
                    <p className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Family history associated
                    </p>
                  </div>
                  <Badge className="w-fit font-bold text-[10px] px-3 py-1 rounded-full bg-amber-600 text-white border-none uppercase">
                    {answer.familyHistories.length} Member{answer.familyHistories.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Answer + Family Data */}
                <div className="p-6 space-y-4">
                  {/* Main Answer */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                    <span className="text-sm font-semibold text-gray-700">Your Answer:</span>
                    <Badge className={`font-bold text-[10px] px-3 py-1 rounded-full ${
                      answer.answerBoolean
                        ? "bg-rose-100 text-rose-700 border-none"
                        : "bg-emerald-100 text-emerald-700 border-none"
                    }`}>
                      {answer.answerBoolean ? "Yes" : "No"}
                    </Badge>
                  </div>

                  {/* Input Value if exists */}
                  {answer.inputValue && (
                    <div className="p-3 bg-white rounded-lg border border-amber-100 flex gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-600"><span className="font-semibold">Details:</span> {answer.inputValue}</p>
                    </div>
                  )}

                  {/* Family History Members */}
                  <div className="bg-white rounded-lg border border-amber-100 p-4 space-y-3">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1">
                      <Users className="w-3 h-3" /> Family Members
                    </p>
                    <div className="space-y-2">
                      {answer.familyHistories.map((fh: any, idx: number) => (
                        <div key={idx} className="p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">{fh.relation}</span>
                            {fh.ageAtDeath && (
                              <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                                Deceased
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-700 space-y-1">
                            {fh.diagnosis && (
                              <p><span className="font-semibold">Diagnosis:</span> {fh.diagnosis}</p>
                            )}
                            {fh.approxAgeOfOnset && (
                              <p><span className="font-semibold">Age of Onset:</span> {fh.approxAgeOfOnset} years</p>
                            )}
                            {fh.ageAtDeath && (
                              <p><span className="font-semibold">Age at Death:</span> {fh.ageAtDeath} years</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Answers Section */}
      {answersWithoutFamily.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-gray-200">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
              Other Responses
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {answersWithoutFamily.map((ans: any) => (
              <div key={ans.id} className={`p-6 rounded-xl border transition-all ${
                ans.answerBoolean ? 'bg-red-50/20 border-red-100' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{ans.question?.category || "General"}</span>
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
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm text-gray-600 italic">"{ans.inputValue}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {processedHealthAnswers.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 flex items-center justify-center min-h-[40vh] p-8">
          <div className="text-center text-gray-400">
            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No questionnaire responses</p>
            <p className="text-xs text-gray-400 mt-2">Health answers will appear here once the application is submitted</p>
          </div>
        </div>
      )}
    </div>
  </motion.div>
  );
};
