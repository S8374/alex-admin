"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  Hash, 
  LayoutGrid, 
  HeartPulse, 
  Dog, 
  UserCheck, 
  Activity, 
  ShieldCheck, 
  FileSpreadsheet
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HealthAnalysis } from "./HealthAnalysis";
import { PetDossier } from "./PetDossier";
import { QuoteSidebar } from "./QuoteSidebar";
import { AgreementTemplate } from "./AgreementTemplate";
import { SentQuotesView } from "../pages/SentQuotesView";

interface QuoteEditorProps {
  application: any;
  onBack: () => void;
  onSendQuote: (form: any) => void;
  isSending: boolean;
  onApproveApplication?: () => void;
  isApprovingApplication?: boolean;
}

export const QuoteEditor = ({ 
  application, 
  onBack, 
  onSendQuote, 
  isSending,
  onApproveApplication,
  isApprovingApplication
}: QuoteEditorProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "health" | "pets" | "agreement" | "sent_quotes">("overview");
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(
    application.pets
      ?.filter((p: any) => {
        const s = p.status?.toUpperCase();
        return s !== "QUOTE_ACCEPTED" && s !== "ACTIVE" && s !== "QUOTE_READY";
      })
      ?.map((p: any) => p.id) || []
  );
  const [quoteForm, setQuoteForm] = useState({
    setupFee: 10,
    transportFee: 500,
    spayNeuterFee: 150,
    dueDay: 1,
    lateFee: 25,
    petCharges: {} as Record<string, number>,
    representativeSignatureUrl: ""
  });

  const togglePetSelection = (petId: string) => {
    setSelectedPetIds(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );
  };

  return (
    <div className="w-full">
      {/* Sticky Editor Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 md:py-6 px-4 md:px-10 -mx-4 md:-mx-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest group transition-all">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" /> Back to queue
            </button>
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl border-2 border-white ">
                <AvatarImage src={application.user.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg md:text-xl">
                  {application.user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-0.5 md:mb-1 truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">{application.user.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center gap-1 md:gap-1.5"><Mail className="w-3 h-3 md:w-4 md:h-4 text-primary" /> <span className="truncate max-w-[150px] sm:max-w-none">{application.user.email}</span></div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1 md:gap-1.5 font-mono uppercase"><Hash className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {application.id.split("-")[0].toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 overflow-x-auto whitespace-nowrap hide-scrollbar w-full max-w-full lg:max-w-max">
            {[
              { id: "overview", label: "Overview", icon: LayoutGrid },
              { id: "health", label: "Health", icon: HeartPulse },
              { id: "pets", label: "Pets", icon: Dog },
              { id: "agreement", label: "Agreement", icon: ShieldCheck },
              { id: "sent_quotes", label: "Sent Quotes", icon: FileSpreadsheet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-[11px] md:text-sm font-bold transition-all ${
                  activeTab === tab.id ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
        <div className={activeTab === "agreement" ? "lg:col-span-8 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto style-scrollbar lg:pr-2" : "lg:col-span-12"}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" /> Applicant Data
                  </h3>
                  <div className="space-y-4">
                    {application.personInfo ? Object.entries(application.personInfo).filter(([k]) => !['id', 'userId', 'applicationId', 'createdAt', 'updatedAt'].includes(k)).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 border-b border-gray-50 pb-3">
                        <span className="text-xs font-semibold text-gray-400 capitalize whitespace-nowrap">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-bold text-gray-900 break-words w-full sm:w-auto sm:text-right">{String(val) || "N/A"}</span>
                      </div>
                    )) : (
                      <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400">Profile data pending submission</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-8 bg-gray-900 rounded-2xl text-white space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none"><ShieldCheck className="w-32 h-32" /></div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Summary
                  </h3>
                  <div className="grid grid-cols-1 gap-4 relative z-10">
                    <div className="p-5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60">Total Pets</span>
                      <span className="text-2xl font-bold">{application.pets.length}</span>
                    </div>
                    <div className="p-5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60">Critical Issues</span>
                      <span className="text-2xl font-bold text-red-400">{application.healthAnswers.filter((a: any) => a.answerBoolean).length}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "health" && <HealthAnalysis answers={application.healthAnswers} />}
            {activeTab === "pets" && (
              <PetDossier 
                pets={application.pets} 
                selectedIds={selectedPetIds} 
                onToggle={togglePetSelection}
                application={application}
              />
            )}
            {activeTab === "sent_quotes" && (
              <motion.div key="sent_quotes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SentQuotesView userId={application.user.id} />
              </motion.div>
            )}
            {activeTab === "agreement" && (
              <motion.div key="agreement" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <AgreementTemplate
                  clientName={application.user.fullName}
                  clientAddress={
                    application.personInfo
                      ? `${application.personInfo.streetAddress || ""}, ${application.personInfo.city || ""}, ${application.personInfo.state || ""} ${application.personInfo.zipCode || ""}`
                      : ""
                  }
                  clientPhone={
                    application.personInfo?.cellPhone || 
                    application.personInfo?.homePhone || 
                    application.personInfo?.workPhone || 
                    ""
                  }
                  clientEmail={application.user.email}
                  representativeName={application.representative?.fullName || ""}
                  representativeEmail={application.representative?.email || ""}
                  representativePhone={application.representative?.phoneNumber || ""}
                  
                  clientFirstName={application.personInfo?.firstName || ""}
                  clientLastName={application.personInfo?.lastName || ""}
                  clientMiddleInitial={application.personInfo?.middleInitial || ""}
                  clientSsnLast4={application.personInfo?.ssnLast4 || ""}
                  clientHomePhone={application.personInfo?.homePhone || ""}
                  clientWorkPhone={application.personInfo?.workPhone || ""}

                  representativeFirstName={application.representative?.fullName?.split(" ")[0] || ""}
                  representativeLastName={application.representative?.fullName?.split(" ").slice(1).join(" ") || ""}
                  representativeMiddleInitial={application.representative?.middleInitial || ""}
                  representativeAddress={application.representative?.streetAddress || ""}
                  representativeCityStateZip={
                    application.representative 
                      ? `${application.representative.city || ""}${application.representative.state ? ", " + application.representative.state : ""}${application.representative.zipCode ? " " + application.representative.zipCode : ""}`
                      : ""
                  }
                  representativeRelation={application.representative?.relationship || ""}
                  representativeHomePhone={application.representative?.homePhone || ""}
                  representativeWorkPhone={application.representative?.workPhone || ""}

                  transportFeePerDog={quoteForm.transportFee}
                  spayNeuterFeePerDog={quoteForm.spayNeuterFee}
                  dueDay={quoteForm.dueDay}
                  lateFee={quoteForm.lateFee}

                  pets={application.pets
                    ?.filter((p: any) => selectedPetIds.includes(p.id))
                    ?.map((p: any) => ({
                      name: p.name,
                      species: p.species || "Dog",
                      gender: p.gender || "MALE",
                      spayedNeutered: p.isSpayedNeutered ? "Yes" : "No",
                      primaryBreed: p.primaryBreed,
                      additionalBreed: p.additionalBreed || "None",
                      colorsAndCoat: p.colorsAndCoat || "N/A",
                      birthday: p.birthday,
                      isMicrochipped: p.isMicrochipped ? "Yes" : "No",
                      microchipNumber: p.microchipNumber,
                      petCharge: quoteForm.petCharges[p.id] || 0
                    }))
                  }
                  setupFee={quoteForm.setupFee}
                  totalMonthlyCharge={Object.values(quoteForm.petCharges).reduce((acc: number, curr: any) => acc + curr, 0)}
                  isSigned={false}
                  healthAnswers={application.healthAnswers}
                  familyHealthHistories={application.familyHealthHistories}
                  representativeSignatureUrl={quoteForm.representativeSignatureUrl}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeTab === "agreement" && (
          <div className="lg:col-span-4 pl-3 lg:sticky lg:top-[230px] self-start">
            <QuoteSidebar 
              pets={application.pets} 
              selectedIds={selectedPetIds} 
              form={quoteForm} 
              onFormUpdate={setQuoteForm} 
              onSend={() => onSendQuote({ ...quoteForm, selectedPetIds })} 
              isSending={isSending} 
              applicationStatus={application.status}
              onApprove={onApproveApplication}
              isApproving={isApprovingApplication}
            />
          </div>
        )}
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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};
