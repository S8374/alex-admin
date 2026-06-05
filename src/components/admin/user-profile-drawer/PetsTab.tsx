"use client";

import React from "react";
import { Dog, Calendar, ShieldCheck, Heart, Weight, Dna } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PetsTabProps {
  user: any;
  isLoading?: boolean;
}

export function PetsTab({ user, isLoading = false }: PetsTabProps) {
  if (isLoading) {
    return <PetsSkeleton />;
  }

  const pets = user.pets || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Dog className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Registered Pets</h3>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-xs px-3">
          {pets.length} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {pets.length > 0 ? (
          pets.map((pet: any, index: number) => (
            <div key={pet.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md group">
              <div className="bg-gray-50/50 border-b border-gray-50 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-200">
                    <AvatarImage src={pet.avatarUrl || pet.imageUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {pet.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 leading-none mb-1">{pet.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dossier #{index + 1}</p>
                  </div>
                </div>
                <Badge className={`rounded-lg font-bold text-[10px] uppercase px-3 py-1 ${
                  pet.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {pet.status}
                </Badge>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Basic Profile */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Heart className="w-3.5 h-3.5" /> Vital Stats
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-xs text-gray-500">Gender</span>
                        <span className="text-xs font-bold text-gray-900">{pet.gender}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-xs text-gray-500">Species</span>
                        <span className="text-xs font-bold text-gray-900">{pet.species}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-xs text-gray-500">Fixed</span>
                        <span className="text-xs font-bold text-gray-900">{pet.isSpayedNeutered ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Breed & Appearance */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Dna className="w-3.5 h-3.5" /> Genetics & Coat
                    </div>
                    <div className="space-y-3">
                      <div className="py-2 border-b border-gray-50">
                        <p className="text-[10px] text-gray-400 mb-1">Primary Breed</p>
                        <p className="text-xs font-bold text-gray-900">{pet.primaryBreed}</p>
                      </div>
                      <div className="py-2 border-b border-gray-50">
                        <p className="text-[10px] text-gray-400 mb-1">Coat Color</p>
                        <p className="text-xs font-bold text-gray-900">{pet.colorsAndCoat || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tech & Dates */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5" /> Identification
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Microchip</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${pet.isMicrochipped ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {pet.isMicrochipped ? "Verified" : "Missing"}
                        </span>
                      </div>
                      {pet.isMicrochipped && (
                        <p className="text-xs font-mono font-bold text-gray-700">{pet.microchipNumber}</p>
                      )}
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Birthday</span>
                        <span className="text-xs font-bold text-gray-900">
                          {pet.birthday ? new Date(pet.birthday).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <Dog className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No pets registered yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PetsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="h-4 w-44 rounded-full bg-gray-200" />
        <div className="h-7 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 border-b border-gray-50 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-full bg-gray-200" />
                  <div className="h-3 w-20 rounded-full bg-gray-200" />
                </div>
              </div>
              <div className="h-7 w-20 rounded-full bg-gray-200" />
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-48 rounded-xl bg-gray-100" />
                <div className="h-48 rounded-xl bg-gray-100" />
                <div className="h-48 rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
