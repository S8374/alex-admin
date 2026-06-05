"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Eye,
  FileSignature,
  Download,
  AlertCircle,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Upload,
  FileUp,
  Loader2
} from "lucide-react";
import { 
  useGetAllAgreementDocsQuery, 
  useCreateAgreementDocMutation, 
  useUpdateAgreementDocMutation, 
  useDeleteAgreementDocMutation 
} from "@/redux/api/AgreemenApi";
import { useUploadDocumentsMutation } from "@/redux/api/UploadApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function AgreementManagementView() {
  const { data: response, isLoading } = useGetAllAgreementDocsQuery(undefined);
  const [createDoc, { isLoading: isCreating }] = useCreateAgreementDocMutation();
  const [updateDoc, { isLoading: isUpdating }] = useUpdateAgreementDocMutation();
  const [deleteDoc] = useDeleteAgreementDocMutation();
  const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation();

  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const [editData, setEditData] = useState({ id: "", agreementDocURL: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const agreements = response?.data || [];
  const hasAgreement = agreements.length > 0;
  const currentAgreement = agreements[0];

  const handleEdit = (doc: any) => {
    setEditData({ id: doc.id, agreementDocURL: doc.agreementDocURL || "" });
    setViewMode("edit");
  };

  const handleSave = async () => {
    if (!editData.agreementDocURL) {
      toast.error("Please provide a valid document URL or upload a file");
      return;
    }

    try {
      if (editData.id) {
        await updateDoc({ id: editData.id, agreementDocURL: editData.agreementDocURL }).unwrap();
        toast.success("Link updated successfully");
      } else {
        await createDoc({ agreementDocURL: editData.agreementDocURL }).unwrap();
        toast.success("Document link published");
      }
      setViewMode("list");
    } catch (error: any) {
      toast.error(error.data?.message || "Operation failed");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await uploadDocuments(formData).unwrap();
      const uploadedUrl = res.data.urls[0];
      setEditData(prev => ({ ...prev, agreementDocURL: uploadedUrl }));
      toast.success("File uploaded and linked");
    } catch (error: any) {
      toast.error(error.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Removing the link will stop new enrollments.")) return;
    try {
      await deleteDoc(id).unwrap();
      toast.success("Document link removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Connecting...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-20">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none mb-1">Legal Agreements</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Remote Document Vault</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === "list" ? (
            !hasAgreement && (
              <button 
                onClick={() => {
                  setEditData({ id: "", agreementDocURL: "" });
                  setViewMode("edit");
                }}
                className="h-9 px-4 bg-primary hover:bg-[#7490c0] text-white rounded-lg font-bold text-xs transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Document Link
              </button>
            )
          ) : (
            <button 
              onClick={() => setViewMode("list")}
              className="h-9 px-4 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg font-bold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "edit" ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-none mb-2">Source Configuration</h2>
                    <p className="text-sm text-gray-400 font-medium">Link an external URL or upload a direct PDF/Document.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="h-11 px-6 bg-primary/10 text-primary rounded-xl font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 border border-primary/20"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Uploading..." : "Upload PDF/DOC"}
                  </button>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Live Document URL</label>
                  <div className="relative">
                    <input 
                      value={editData.agreementDocURL}
                      onChange={(e) => setEditData({ ...editData, agreementDocURL: e.target.value })}
                      className="w-full h-14 bg-gray-50 border-none rounded-xl px-5 pr-12 text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Paste link here or upload above..."
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <Globe className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isCreating || isUpdating || isUploading}
                  className="h-11 px-10 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {isCreating || isUpdating ? "Publishing..." : "Confirm & Publish"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gray-900 p-8 rounded-2xl text-white space-y-4 shadow-xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Digital Integrity</h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Uploading a document directly ensures the source is managed by our secure servers. External links depend on the provider's availability.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {hasAgreement ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] px-2 py-0.5 rounded-md uppercase mb-2">
                          Active Framework
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                          Member Service Agreement 
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(currentAgreement)}
                          className="h-9 px-4 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                        >
                          <Edit3 className="w-4 h-4" /> Update Source
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between group cursor-pointer" onClick={() => window.open(currentAgreement.agreementDocURL, '_blank')}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden max-w-[400px]">
                          <p className="text-xs font-bold text-gray-900 truncate">{currentAgreement.agreementDocURL}</p>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-tight">Tap to inspect document</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Linked {new Date(currentAgreement.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(currentAgreement.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs font-bold text-gray-500">Document Node</span>
                        <span className="text-xs font-black text-emerald-500">Stable</span>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-start gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-emerald-700 font-bold uppercase leading-tight tracking-tight">
                          This document is now being served to all active enrollment queues.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Link Required</h3>
                <p className="text-sm text-gray-400 font-medium max-w-xs mb-8">
                  Upload a PDF or link a remote Google Doc to initialize the legal framework.
                </p>
                <button 
                  onClick={() => {
                    setEditData({ id: "", agreementDocURL: "" });
                    setViewMode("edit");
                  }}
                  className="h-11 px-8 bg-gray-900 text-white rounded-xl font-bold text-xs shadow-xl transition-all"
                >
                  Configure Remote Link
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
