"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Dog, Settings2, ArrowRight, Pencil, Type, Upload, Loader2, X, Trash2, Check } from "lucide-react";
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

type SigMode = "draw" | "type" | "upload";

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
  const sigFileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sigMode, setSigMode] = useState<SigMode>("draw");
  const [typedName, setTypedName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  
  const selectedPets = pets.filter(p => selectedIds.includes(p.id));
  const monthlyTotal = Object.values(form.petCharges).reduce((acc: number, curr: any) => acc + curr, 0);
  const dueNow = monthlyTotal + form.setupFee;

  // Init canvas
  useEffect(() => {
    if (sigMode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [sigMode]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    setHasSigned(true);
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onFormUpdate({ ...form, representativeSignatureUrl: "" });
  };

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const [header, data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "image/png";
    const bin = atob(data);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new File([arr], filename, { type: mime });
  };

  const applySignature = async () => {
    if (sigMode === "draw") {
      if (!hasSigned) { toast.error("Please draw your signature first"); return; }
      const canvas = canvasRef.current;
      if (!canvas) return;
      toast.info("Uploading signature...");
      const dataUrl = canvas.toDataURL("image/png");
      const file = dataURLtoFile(dataUrl, "admin-signature.png");
      const fd = new FormData();
      fd.append("files", file);
      try {
        const res = await uploadDocuments(fd).unwrap();
        const url = res.data?.urls?.[0];
        if (url) {
          onFormUpdate({ ...form, representativeSignatureUrl: url });
          toast.success("Signature applied!");
        } else {
          toast.error("Failed to upload signature");
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Upload failed");
      }
    } else if (sigMode === "type") {
      if (!typedName.trim()) { toast.error("Please type your name"); return; }
      // Render typed name to canvas and upload
      toast.info("Generating signature...");
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 180;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "italic 44px 'Caveat', cursive, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2 - 10);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 120);
      ctx.quadraticCurveTo(250, 135, 420, 115);
      ctx.stroke();
      const dataUrl = canvas.toDataURL("image/png");
      const file = dataURLtoFile(dataUrl, "admin-signature.png");
      const fd = new FormData();
      fd.append("files", file);
      try {
        const res = await uploadDocuments(fd).unwrap();
        const url = res.data?.urls?.[0];
        if (url) {
          onFormUpdate({ ...form, representativeSignatureUrl: url });
          toast.success("Signature applied!");
        } else {
          toast.error("Failed to upload signature");
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Upload failed");
      }
    }
  };

  const handleSigFileUpload = async (file: File) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    try {
      const res = await uploadDocuments(fd).unwrap();
      const url = res.data?.urls?.[0];
      if (url) {
        onFormUpdate({ ...form, representativeSignatureUrl: url });
        toast.success("Signature image uploaded!");
      } else {
        toast.error("Failed to upload");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

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
    <div className="bg-white rounded border border-gray-100 p-5 md:p-6 flex flex-col max-h-[calc(100vh-140px)] lg:max-h-[calc(100vh-260px)] overflow-y-auto sticky top-24 lg:top-[230px] style-scrollbar">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
        <Settings2 className="w-4 h-4 text-primary" /> Financials
      </h3>

      <div className="space-y-4 flex-1">
        {/* Setup Fee */}
        <div className="p-4 bg-gray-50 rounded border border-gray-100">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Activation Fee</p>
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="text-xl font-bold text-gray-400">$</span>
            <input 
              type="number"
              value={form.setupFee}
              onChange={(e) => onFormUpdate({ ...form, setupFee: Number(e.target.value) })}
              className="bg-transparent text-2xl font-bold text-gray-900 outline-none w-full border-none"
            />
          </div>
        </div>

        {/* Contract Variables */}
        <div className="p-4 bg-gray-50 rounded border border-gray-100 space-y-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Contract Variables</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Transport Fee ($/dog)</label>
              <input 
                type="number"
                value={form.transportFee ?? 50}
                onChange={(e) => onFormUpdate({ ...form, transportFee: Number(e.target.value) })}
                className="w-full h-9 px-3 mt-1 bg-white rounded text-xs font-bold text-gray-900 outline-none border border-gray-200 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Spay/Neuter ($/dog)</label>
              <input 
                type="number"
                value={form.spayNeuterFee ?? 150}
                onChange={(e) => onFormUpdate({ ...form, spayNeuterFee: Number(e.target.value) })}
                className="w-full h-9 px-3 mt-1 bg-white rounded text-xs font-bold text-gray-900 outline-none border border-gray-200 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Due Day of Month</label>
              <input 
                type="number"
                min={1}
                max={28}
                value={form.dueDay ?? 1}
                onChange={(e) => onFormUpdate({ ...form, dueDay: Number(e.target.value) })}
                className="w-full h-9 px-3 mt-1 bg-white rounded text-xs font-bold text-gray-900 outline-none border border-gray-200 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Late Fee ($)</label>
              <input 
                type="number"
                value={form.lateFee ?? 25}
                onChange={(e) => onFormUpdate({ ...form, lateFee: Number(e.target.value) })}
                className="w-full h-9 px-3 mt-1 bg-white rounded text-xs font-bold text-gray-900 outline-none border border-gray-200 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pet Slips */}
        <div className="space-y-3">
          {selectedPets.map((pet: any) => (
            <div key={pet.id} className="p-4 bg-gray-50 rounded border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-primary" />
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
                    className="w-full h-10 pl-8 pr-3 bg-white rounded text-base font-bold text-gray-900 outline-none border border-gray-200 focus:border-primary transition-all"
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

        {/* ── Admin Signature ── */}
        <div className="p-4 bg-gray-50 rounded border border-gray-100 space-y-3">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Signature (K9 Encore LLC)</p>

          {/* Mode Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded p-0.5">
            {([
              { id: "draw", label: "Draw", icon: Pencil },
              { id: "type", label: "Type", icon: Type }
            ] as { id: SigMode; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setSigMode(id); }}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold transition-all ${sigMode === id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
          </div>

          {/* Current signature preview */}
          {form.representativeSignatureUrl && (
            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-bold text-emerald-700 flex-1">Signature applied</span>
              <button
                onClick={() => { onFormUpdate({ ...form, representativeSignatureUrl: "" }); setHasSigned(false); setTypedName(""); }}
                className="text-rose-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Draw Mode */}
          {sigMode === "draw" && (
            <div className="space-y-2">
              <div className="relative border-2 border-dashed border-gray-200 rounded-lg bg-white overflow-hidden" style={{ height: 120 }}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={120}
                  className="w-full h-full touch-none"
                  style={{ cursor: "crosshair" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-[11px] text-gray-300 font-medium">Draw your signature here</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearCanvas}
                  className="flex-1 flex items-center justify-center gap-1 h-8 text-[10px] font-bold text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
                <button
                  onClick={applySignature}
                  disabled={isUploading || !hasSigned}
                  className="flex-1 flex items-center justify-center gap-1 h-8 text-[10px] font-bold text-white bg-gray-900 rounded hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Type Mode */}
          {sigMode === "type" && (
            <div className="space-y-2">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your full name"
                className="w-full h-9 px-3 bg-white rounded text-sm outline-none border border-gray-200 focus:border-primary transition-all"
                style={{ fontFamily: "'Caveat', cursive", fontSize: 20 }}
              />
              {typedName && (
                <div className="h-14 border border-gray-100 rounded bg-white flex items-center justify-center">
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: "#1e3a8a" }}>
                    {typedName}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  if (!typedName.trim()) { toast.error("Please type your name"); return; }
                  onFormUpdate({ ...form, representativeSignatureUrl: `TYPED:${typedName.trim()}` });
                  toast.success("Signature applied!");
                }}
                disabled={!typedName.trim()}
                className="w-full flex items-center justify-center gap-1 h-8 text-[10px] font-bold text-white bg-gray-900 rounded hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                Apply Signature
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-900">${monthlyTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due Today</p>
            <p className="text-lg font-bold text-primary">${dueNow.toFixed(2)}</p>
          </div>
        </div>

        <Button 
          disabled={
            isSending || 
            selectedIds.length === 0 || 
            Object.values(form.petCharges).length === 0
          }
          onClick={onSend}
          className="w-full h-12 rounded bg-gray-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all  disabled:opacity-50"
        >
          {isSending ? "Processing..." : " Send"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <style>{`
        .style-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .style-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .style-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .style-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};
