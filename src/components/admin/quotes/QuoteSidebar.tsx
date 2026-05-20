"use client";

import React from "react";
import { Dog, Settings2, ArrowRight, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuoteSidebarProps {
  pets: any[];
  selectedIds: string[];
  form: any;
  onFormUpdate: (f: any) => void;
  onSend: () => void;
  isSending: boolean;
}

export const QuoteSidebar = ({ 
  pets, 
  selectedIds, 
  form, 
  onFormUpdate, 
  onSend, 
  isSending 
}: QuoteSidebarProps) => {
  const selectedPets = pets.filter(p => selectedIds.includes(p.id));
  const monthlyTotal = Object.values(form.petCharges).reduce((acc: number, curr: any) => acc + curr, 0);
  const dueNow = monthlyTotal + form.setupFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 flex flex-col h-fit sticky top-24">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
        <Settings2 className="w-4 h-4 text-[#85A1D1]" /> Financials
      </h3>

      <div className="space-y-6 flex-1">
        {/* Setup Fee */}
        <div className="p-6 bg-gray-900 rounded-xl text-white shadow-lg">
          <p className="text-[10px] font-bold text-[#85A1D1] uppercase tracking-widest mb-2">Activation Fee</p>
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="text-xl font-bold text-white/40">$</span>
            <input 
              type="number"
              value={form.setupFee}
              onChange={(e) => onFormUpdate({ ...form, setupFee: Number(e.target.value) })}
              className="bg-transparent text-2xl font-bold outline-none w-full"
            />
          </div>
        </div>

        {/* Dynamic Pet Slips */}
        <div className="space-y-3">
          {selectedPets.map((pet: any) => (
            <div key={pet.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-[#85A1D1]" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{pet.name}</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-2 py-0.5">Selected</Badge>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-300">$</span>
                  <input 
                    type="number"
                    placeholder="Monthly Premium"
                    value={form.petCharges[pet.id] || ""}
                    onChange={(e) => onFormUpdate({
                      ...form,
                      petCharges: { ...form.petCharges, [pet.id]: Number(e.target.value) }
                    })}
                    className="w-full h-10 pl-8 pr-3 bg-white rounded-lg text-base font-bold text-gray-900 outline-none border border-gray-200 focus:border-[#85A1D1] transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <p className="text-xs text-gray-400">Select pets from dossier to configure quotes</p>
            </div>
          )}
        </div>

        {/* Unified Agreement Document URL */}
        {selectedIds.length > 0 && (
          <div className="p-4 bg-[#85A1D1]/10 rounded-xl border border-[#85A1D1]/20 space-y-2">
            <p className="text-[10px] font-bold text-[#5675A5] uppercase tracking-widest">
              Agreement Document
            </p>
            <div className="relative">
              <input 
                type="text"
                placeholder="Agreement PDF URL (Required)"
                value={form.sharedAgreementUrl || ""}
                onChange={(e) => onFormUpdate({
                  ...form,
                  sharedAgreementUrl: e.target.value
                })}
                className="w-full h-10 px-3 bg-white rounded-lg text-xs font-semibold text-gray-700 outline-none border border-gray-200 focus:border-[#85A1D1] transition-all"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {selectedIds.length > 1 
                ? "This agreement document will be shared by all selected pets." 
                : "Agreement document for this pet quote."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-900">${monthlyTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due Today</p>
            <p className="text-lg font-bold text-[#85A1D1]">${dueNow.toFixed(2)}</p>
          </div>
        </div>

        <Button 
          disabled={
            isSending || 
            selectedIds.length === 0 || 
            Object.values(form.petCharges).length === 0 ||
            !form.sharedAgreementUrl?.trim()
          }
          onClick={onSend}
          className="w-full h-12 rounded-xl bg-gray-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md disabled:opacity-50"
        >
          {isSending ? "Processing..." : "Approve & Send"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
