"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dog, Check, Weight, Cake, Syringe, Stethoscope, FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgreementTemplate } from "./AgreementTemplate";

function calculateAge(birthday?: string | null): string {
  if (!birthday) return "N/A";
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) return "N/A";
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return `${Math.max(age, 0)} yrs`;
}

interface PetDossierProps {
  pets: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  application?: any; // full application data for agreement preview
}

export const PetDossier = ({
  pets,
  selectedIds,
  onToggle,
  application
}: PetDossierProps) => {
  const [agreementPet, setAgreementPet] = useState<any | null>(null);

  console.log("PETDOSSIER API URL:", process.env.NEXT_PUBLIC_BASE_API_URL);
  console.log("PETDOSSIER PETS DATA:", pets);

  useEffect(() => {
    if (agreementPet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [agreementPet]);

  const getAgreementParams = (pet: any) => {
    // Try to extract URL params from the pet's quote agrementUrl
    const quote = (pet.sendQuotes || [])[0];
    const agrementUrl = quote?.agrementUrl || "";
    const queryStr = agrementUrl.includes("?") ? agrementUrl.split("?")[1] : "";
    const params = new URLSearchParams(queryStr);
    return {
      transportFee: Number(params.get("transportFee") || 50),
      spayNeuterFee: Number(params.get("spayNeuterFee") || 150),
      dueDay: Number(params.get("dueDay") || 1),
      lateFee: Number(params.get("lateFee") || 25),
      representativeSignatureUrl: params.get("representativeSignatureUrl") || null,
      adminName: params.get("adminName") || null,
      setupFee: Number(quote?.setupFee || 10),
      petCharge: Number(pet.petCharge || quote?.monthlyCharge || 0),
    };
  };

  return (
    <>
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
            const hasAgreement = statusUpper === "QUOTE_ACCEPTED" || statusUpper === "ACTIVE" || statusUpper === "QUOTE_READY";

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
                    { icon: Dog, label: "Gender", val: pet.gender === "FEMALE" ? "Female" : "Male" },
                    { icon: Cake, label: "Age", val: calculateAge(pet.birthday) },
                    { icon: Syringe, label: "Spayed/Neutered", val: pet.isSpayedNeutered ? "Yes" : "No" },
                    { icon: Stethoscope, label: "Microchipped", val: pet.isMicrochipped ? (pet.microchipId || pet.microchipNumber || "Yes") : "No" }
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

                {/* View Agreement Button */}
                {hasAgreement && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAgreementPet(pet);
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 h-8 rounded-lg border border-primary/30 bg-primary/5 text-primary text-[11px] font-bold hover:bg-primary/10 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Agreement
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Agreement Modal */}
      <AnimatePresence>
        {agreementPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
            onClick={() => setAgreementPet(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10 shrink-0">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Agreement — {agreementPet.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{agreementPet.primaryBreed} • {agreementPet.status}</p>
                </div>
                <button
                  onClick={() => setAgreementPet(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Agreement Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar overscroll-contain" data-lenis-prevent>
                {(() => {
                  const params = getAgreementParams(agreementPet);
                  const personInfo = application?.personInfo;
                  const rep = application?.representative;
                  const quote = (agreementPet.sendQuotes || [])[0];

                  return (
                    <AgreementTemplate
                      clientName={application?.user?.fullName || ""}
                      clientAddress={personInfo ? `${personInfo.streetAddress || ""}, ${personInfo.city || ""}, ${personInfo.state || ""} ${personInfo.zipCode || ""}` : ""}
                      clientPhone={personInfo?.cellPhone || personInfo?.homePhone || personInfo?.workPhone || ""}
                      clientEmail={application?.user?.email || ""}
                      clientFirstName={personInfo?.firstName || ""}
                      clientLastName={personInfo?.lastName || ""}
                      clientMiddleInitial={personInfo?.middleInitial || ""}
                      clientSsnLast4={personInfo?.ssnLast4 || ""}
                      clientHomePhone={personInfo?.homePhone || ""}
                      clientWorkPhone={personInfo?.workPhone || ""}
                      representativeName={rep?.fullName || ""}
                      representativeEmail={rep?.email || ""}
                      representativePhone={rep?.phoneNumber || ""}
                      representativeFirstName={rep?.fullName?.split(" ")[0] || ""}
                      representativeLastName={rep?.fullName?.split(" ").slice(1).join(" ") || ""}
                      representativeMiddleInitial={rep?.middleInitial || ""}
                      representativeAddress={rep?.streetAddress || ""}
                      representativeCityStateZip={rep ? `${rep.city || ""}${rep.state ? ", " + rep.state : ""}${rep.zipCode ? " " + rep.zipCode : ""}` : ""}
                      representativeRelation={rep?.relationship || ""}
                      representativeHomePhone={rep?.homePhone || ""}
                      representativeWorkPhone={rep?.workPhone || ""}
                      transportFeePerDog={params.transportFee}
                      spayNeuterFeePerDog={params.spayNeuterFee}
                      dueDay={params.dueDay}
                      lateFee={params.lateFee}
                      pets={[{
                        name: agreementPet.name,
                        species: agreementPet.species || "Dog",
                        gender: agreementPet.gender || "MALE",
                        spayedNeutered: agreementPet.isSpayedNeutered ? "Yes" : "No",
                        primaryBreed: agreementPet.primaryBreed,
                        additionalBreed: agreementPet.additionalBreed || "None",
                        colorsAndCoat: agreementPet.colorsAndCoat || "N/A",
                        birthday: agreementPet.birthday,
                        isMicrochipped: agreementPet.isMicrochipped ? "Yes" : "No",
                        microchipNumber: agreementPet.microchipNumber,
                        petCharge: params.petCharge,
                      }]}
                      setupFee={params.setupFee}
                      totalMonthlyCharge={params.petCharge}
                      isSigned={!!(quote?.agreements?.[0]?.isSigned)}
                      signatureDocUrl={quote?.agreements?.[0]?.signatureDocUrl || null}
                      signedDate={quote?.agreements?.[0]?.signedAt || null}
                      representativeSignatureUrl={params.representativeSignatureUrl}
                      adminName={params.adminName || ""}
                      healthAnswers={application?.healthAnswers || []}
                      familyHealthHistories={application?.familyHealthHistories || []}
                    />
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
