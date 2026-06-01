"use client";

import React, { useRef, useState } from "react";
import { Dog, Settings2, ArrowRight, LayoutGrid, Upload, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUploadDocumentsMutation } from "@/redux/api/UploadApi";
import { toast } from "sonner";

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
  const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const selectedPets = pets.filter(p => selectedIds.includes(p.id));
  const monthlyTotal = Object.values(form.petCharges).reduce((acc: number, curr: any) => acc + curr, 0);
  const dueNow = monthlyTotal + form.setupFee;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await uploadDocuments(formData).unwrap();
      const uploadedUrl = res.data?.urls?.[0];
      
      if (uploadedUrl) {
        onFormUpdate({ ...form, sharedAgreementUrl: uploadedUrl });
        toast.success("Agreement document uploaded successfully");
      } else {
        toast.error("Failed to retrieve document URL");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Upload failed. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word") || file.type.includes("document"))) {
      handleFileUpload(file);
    } else {
      toast.error("Please drop a PDF or DOC/DOCX file");
    }
  };

  return (
    <div className="bg-white rounded border border-gray-100  p-8 flex flex-col h-fit sticky top-24">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
        <Settings2 className="w-4 h-4 text-[#85A1D1]" /> Financials
      </h3>

      <div className="space-y-6 flex-1">
        {/* Setup Fee */}
        <div className="p-6 bg-white rounded text-black ">
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
            <div key={pet.id} className="p-4 bg-gray-50 rounded border border-gray-100 space-y-3">
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
                    className="w-full h-10 pl-8 pr-3 bg-white rounded text-base font-bold text-gray-900 outline-none border border-gray-200 focus:border-[#85A1D1] transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <div className="p-8 text-center border border-dashed border-gray-200 rounded bg-gray-50/50">
              <p className="text-xs text-gray-400">Select pets from dossier to configure quotes</p>
            </div>
          )}
        </div>

        {/* Unified Agreement Document URL */}
        {selectedIds.length > 0 && (
          <div className="p-4 bg-[#85A1D1]/10 rounded border border-[#85A1D1]/20 space-y-3">
            <p className="text-[10px] font-bold text-[#5675A5] uppercase tracking-widest">
              Agreement Document
            </p>
            
            {/* Upload Section */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                dragOver 
                  ? "border-[#85A1D1] bg-[#85A1D1]/10" 
                  : "border-gray-200 hover:border-[#85A1D1]/40 bg-white"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center justify-center gap-2 py-2">
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#85A1D1] animate-spin" />
                    <span className="text-[10px] font-bold text-[#85A1D1] uppercase tracking-tight">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Drop PDF/DOC or click</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            {/* URL Input */}
            <div className="relative space-y-1">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Or paste URL directly</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Paste agreement URL..."
                  value={form.sharedAgreementUrl || ""}
                  onChange={(e) => onFormUpdate({
                    ...form,
                    sharedAgreementUrl: e.target.value
                  })}
                  className="flex-1 h-9 px-3 bg-white rounded text-xs font-semibold text-gray-700 outline-none border border-gray-200 focus:border-[#85A1D1] transition-all"
                />
                {form.sharedAgreementUrl && (
                  <button
                    onClick={() => onFormUpdate({ ...form, sharedAgreementUrl: "" })}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {form.sharedAgreementUrl && (
              <div className="p-2 bg-emerald-50 rounded border border-emerald-100 flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Document ready</p>
              </div>
            )}
            
            <p className="text-[10px] text-gray-400 mt-1">
              {selectedIds.length > 1 
                ? "This agreement will be shared by all selected pets." 
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
          className="w-full h-12 rounded bg-gray-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all  disabled:opacity-50"
        >
          {isSending ? "Processing..." : " Send"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
