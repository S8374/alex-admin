"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dog, Check, Weight, Cake, Syringe, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PetDossierProps {
  pets: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const PetDossier = ({
  pets,
  selectedIds,
  onToggle
}: PetDossierProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Pet Dossier</h3>
        <p className="text-xs text-gray-400 mt-1">Select pets for this coverage plan</p>
      </div>
      <Badge className="bg-primary text-white border-none font-bold text-xs px-3">
        {selectedIds.length} / {pets.length} Selected
      </Badge>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pets.map((pet: any) => {
        const isSelected = selectedIds.includes(pet.id);
        const statusUpper = pet.status?.toUpperCase() || "";
        const isDisabled = statusUpper === "QUOTE_ACCEPTED" || statusUpper === "ACTIVE" || statusUpper === "QUOTE_READY";
        const rejectedQuote = (pet.sendQuotes || []).find((quote: any) => quote.isRejected) || (pet.sendQuotes || [])[0];
        const rejectionReason = rejectedQuote?.rejectionReason || pet.rejectionReason || pet.quoteRejectionReason;
        return (
          <div
            key={pet.id}
            onClick={() => {
              if (isDisabled) return;
              onToggle(pet.id);
            }}
            className={`p-6 rounded-xl border transition-all relative group ${isDisabled
                ? 'bg-gray-100/50 border-gray-200 opacity-60 cursor-not-allowed'
                : isSelected
                  ? 'bg-white border-primary shadow-md ring-1 ring-primary/5 cursor-pointer'
                  : 'bg-gray-50/50 border-gray-100 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 cursor-pointer'
              }`}
          >
            <div className="absolute top-4 right-4">
              {!isDisabled && (
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-transparent'
                  }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Dog className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-gray-900">{pet.name}</h4>
                  {(statusUpper === "QUOTE_ACCEPTED" || statusUpper === "ACTIVE") && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[9px] px-1.5 py-0.5">
                      Active Coverage
                    </Badge>
                  )}
                  {statusUpper === "QUOTE_READY" && (
                    <Badge className="bg-amber-50 text-amber-700 border-none font-bold text-[9px] px-1.5 py-0.5">
                      Quote Sent
                    </Badge>
                  )}
                  {statusUpper === "QUOTE_REJECTED" && (
                    <div className="space-y-1">
                      <Badge className="bg-rose-50 text-rose-700 border-none font-bold text-[9px] px-1.5 py-0.5">
                        Quote Rejected
                      </Badge>

                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{pet.primaryBreed}</p>
                  {rejectionReason && (
                  <p className="max-w-55 text-[11px] leading-4 text-rose-600 font-medium">
                    Rejection Reason: {rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Weight, label: "Weight", val: `${pet.weight} lbs` },
                { icon: Cake, label: "Age", val: `${pet.age} yrs` },
                { icon: Syringe, label: "Vax", val: "Verified" },
                { icon: Stethoscope, label: "History", val: "Clean" }
              ].map((stat, i) => (
                <div key={i} className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
                  <stat.icon className="w-3.5 h-3.5 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{stat.label}</p>
                    <p className="text-xs font-bold text-gray-900">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);
