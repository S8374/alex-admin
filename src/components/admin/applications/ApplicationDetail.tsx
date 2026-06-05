"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Dog, 
  HeartPulse, 
  Users, 
  CheckCircle2, 
  XCircle,
  Clock,
  Calendar,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicationDetailProps {
  application: any;
  onBack: () => void;
  onStatusUpdate: (status: string) => void;
  isUpdating: boolean;
  isLoading: boolean;
  onPrepareQuote?: () => void;
}

export const ApplicationDetail = ({ 
  application, 
  onBack, 
  onStatusUpdate, 
  isUpdating,
  isLoading,
  onPrepareQuote
}: ApplicationDetailProps) => {
  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Application Details...</p>
      </div>
    );
  }

  if (!application) return null;

  const { user, pets, personInfo, representative, healthAnswers, status, createdAt } = application;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-xs px-3 py-1 uppercase">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-50 text-rose-600 border border-rose-100 font-bold text-xs px-3 py-1 uppercase">Rejected</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs px-3 py-1 uppercase">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-xs px-3 py-1 uppercase">Under Review</Badge>;
      case "QUOTE_READY":
        return <Badge className="bg-purple-50 text-purple-600 border border-purple-100 font-bold text-xs px-3 py-1 uppercase">Quote Ready</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-500 border border-gray-200 font-bold text-xs px-3 py-1 uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-4 md:px-10 -mx-4 md:-mx-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest group transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to applications
            </button>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{user?.fullName || "Applicant"}</h1>
                  {getStatusBadge(status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Submitted: {new Date(createdAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user?.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status !== "APPROVED" && status !== "REJECTED" && (
              <>
                <Button 
                  onClick={() => onStatusUpdate("REJECTED")} 
                  disabled={isUpdating}
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs uppercase tracking-widest px-6 h-10 transition-all"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button 
                  onClick={() => onStatusUpdate("APPROVED")} 
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest px-6 h-10 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </>
            )}
            {(status === "APPROVED" || status === "QUOTE_READY") && (
               <Button
               onClick={onPrepareQuote}
               variant="outline"
               className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-xs uppercase tracking-widest px-6 h-10 transition-all"
             >
                Prepare Quote
             </Button>
            )}
          </div>
        </div>
      </div>

      <div className="py-8">
        <Tabs defaultValue="applicant" className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <TabsList className="h-14 bg-transparent gap-8 px-6 md:px-10 flex justify-start border-none">
              <TabsTrigger value="applicant" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-bold text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all">
                <User className="w-4 h-4 mr-2" /> Applicant
              </TabsTrigger>
              <TabsTrigger value="pets" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-bold text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all">
                <Dog className="w-4 h-4 mr-2" /> Pets ({pets?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="health" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-bold text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all">
                <HeartPulse className="w-4 h-4 mr-2" /> Health
              </TabsTrigger>
              <TabsTrigger value="representative" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-bold text-xs uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 transition-all">
                <Users className="w-4 h-4 mr-2" /> Representative
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <TabsContent value="applicant" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Basic Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow label="Full Name" value={user?.fullName} />
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="Phone" value={personInfo?.cellPhone || "N/A"} />
                    <InfoRow label="Date of Birth" value={personInfo?.birthday ? new Date(personInfo.birthday).toLocaleDateString() : "N/A"} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Address Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow label="Street" value={personInfo?.streetAddress || "N/A"} />
                    <InfoRow label="City" value={personInfo?.city || "N/A"} />
                    <InfoRow label="State" value={personInfo?.state || "N/A"} />
                    <InfoRow label="ZIP Code" value={personInfo?.zipCode || "N/A"} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pets" className="mt-0 outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {pets?.map((pet: any) => (
                  <div key={pet.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex gap-6">
                    <Avatar className="w-20 h-20 rounded-xl border-2 border-white shadow-sm">
                      <AvatarImage src={pet.photoUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Dog className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-900">{pet.name}</h4>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">{pet.gender}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        <PetInfo label="Breed" value={pet.primaryBreed} />
                        <PetInfo label="Age" value={pet.birthday ? `${new Date().getFullYear() - new Date(pet.birthday).getFullYear()} Years` : "N/A"} />
                        <PetInfo label="Microchipped" value={pet.isMicrochipped ? "Yes" : "No"} />
                        <PetInfo label="Spayed/Neutered" value={pet.isSpayedNeutered ? "Yes" : "No"} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-0 outline-none">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" /> Health Questionnaire Responses
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {healthAnswers?.length ? healthAnswers.map((answer: any) => (
                    <div key={answer.id} className="p-6 hover:bg-gray-50/30 transition-all">
                      <p className="text-sm font-bold text-gray-900 mb-2">{answer.question?.questionText || answer.nestedQuestion?.questionText}</p>
                      <div className="flex items-center gap-4">
                        <Badge className={`font-bold text-[10px] uppercase ${answer.answerBoolean ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {answer.answerBoolean ? "Yes" : "No"}
                        </Badge>
                        {answer.inputValue && (
                          <span className="text-xs text-gray-500 italic">"{answer.inputValue}"</span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-300">
                      <p className="text-sm font-medium">No questionnaire responses found</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="representative" className="mt-0 outline-none">
              <div className="max-w-2xl bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{representative?.fullName || "No Representative Provided"}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{representative?.relationship || "Representative"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <InfoRow label="Email" value={representative?.email || "N/A"} />
                  <InfoRow label="Phone" value={representative?.phoneNumber || "N/A"} />
                  <InfoRow label="City" value={representative?.city || "N/A"} />
                  <InfoRow label="State" value={representative?.state || "N/A"} />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-gray-900">{value}</p>
  </div>
);

const PetInfo = ({ label, value }: { label: string; value: any }) => (
  <div className="space-y-0.5">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
    <p className="text-[11px] font-bold text-gray-800">{value}</p>
  </div>
);
