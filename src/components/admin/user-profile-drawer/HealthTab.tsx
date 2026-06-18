"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, HeartPulse, Activity, CheckCircle2, Info, AlertCircle, Users } from "lucide-react";

interface HealthTabProps {
  user: any;
  isLoading?: boolean;
}

export function HealthTab({ user, isLoading = false }: HealthTabProps) {
  if (isLoading) {
    return <HealthSkeleton />;
  }

  const applications = user.applications || [];
  const healthAnswers = applications.flatMap((application: any) =>
    (application.healthAnswers || []).map((answer: any) => ({
      ...answer,
      application,
      familyHistories: (application.familyHealthHistories || []).filter(
        (fh: any) => {
          if (answer.questionId && fh.questionId === answer.questionId) return true;
          if (answer.nestedQuestionId && fh.nestedQuestionId === answer.nestedQuestionId) return true;
          return false;
        }
      ),
    }))
  );

  const answersWithFamily = healthAnswers.filter((a: any) => a.familyHistories.length > 0);
  const answersWithoutFamily = healthAnswers.filter((a: any) => a.familyHistories.length === 0);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Health Responses</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-xs px-3">
            {healthAnswers.length} Total
          </Badge>
          {answersWithFamily.length > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 font-bold text-xs px-3">
              {answersWithFamily.length} Family History
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
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

                    {/* Questionnaire Info */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{answer.questionnaire?.topicTitle || 'General Health'}</p>
                        <p className="text-gray-500">{new Date(answer.createdAt).toLocaleDateString()}</p>
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
            <div className="grid grid-cols-1 gap-3">
              {answersWithoutFamily.map((answer: any) => (
                <div key={answer.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-all">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {answer.question?.questionText || answer.nestedQuestion?.questionText}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(answer.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`w-fit font-bold text-[10px] px-2 py-0.5 rounded ${
                      answer.answerBoolean
                        ? "bg-rose-50 text-rose-600 border-none"
                        : "bg-emerald-50 text-emerald-600 border-none"
                    }`}>
                      {answer.answerBoolean ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {answer.inputValue && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="text-xs text-gray-600 italic p-2 bg-gray-50 rounded border border-gray-100">
                        "{answer.inputValue}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {healthAnswers.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 flex items-center justify-center min-h-[40vh] p-8">
            <div className="text-center text-gray-400">
              <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No questionnaire responses</p>
              <p className="text-xs text-gray-400 mt-2">Health answers will appear here once the application is submitted</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="h-5 w-40 rounded-full bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-24 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
