"use client";

import React, { useState } from "react";
import { CreditCard, Receipt, TrendingUp, ShieldCheck, Wallet, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface FinancialsTabProps {
  user: any;
  isLoading?: boolean;
}

export function FinancialsTab({ user, isLoading = false }: FinancialsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading) {
    return <FinancialsSkeleton />;
  }

  const paymentMethods = user.paymentMethods || [];
  const allPayments = user.payments || [];
  
  const totalPages = Math.ceil(allPayments.length / itemsPerPage);
  const payments = allPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 min-h-screen pb-10">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Financial Records</h3>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-xs px-3">
          {allPayments.length} Transactions
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            <Landmark className="w-3.5 h-3.5" /> Saved Methods
          </div>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method: any) => (
              <div key={method.id} className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02] border border-white/5">
                {/* Card Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                  <Landmark className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{method.provider || "Premium"} Member</p>
                      <Badge className="bg-white/10 text-white border-none text-[8px] h-4 font-black tracking-widest">
                        {method.isDefault ? "PRIMARY" : "SECONDARY"}
                      </Badge>
                    </div>
                    <div className="w-12 h-8 bg-white/10 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center">
                       <CreditCard className="w-5 h-5 text-white/50" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Card Reference</p>
                        <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                          **** {method.last4}
                        </p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Stripe ID</p>
                        <p className="text-[10px] font-mono text-white/70 break-all">{method.stripePaymentMethodId || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Card Holder</p>
                        <p className="text-[11px] font-bold uppercase tracking-widest">{user.fullName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Expires</p>
                        <p className="text-[11px] font-bold">{method.expiryMonth}/{method.expiryYear}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase">No active cards</p>
            </div>
          )}
          
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900 uppercase">Secure Data</p>
                <p className="text-[9px] text-gray-400 font-medium">PCI-DSS Compliant Storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Receipt className="w-3.5 h-3.5" /> Billing History
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="h-11 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-6">Date</TableHead>
                  <TableHead className="h-11 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type & Desc</TableHead>
                  <TableHead className="h-11 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="h-11 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right pr-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment: any) => (
                    <TableRow key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="pl-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-900">{payment.type.replace('_', ' ')}</p>
                          <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs" title={payment.description}>
                            {payment.description || "Service premium processed"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-gray-400 font-mono" title="Transaction ID">TX: {payment.transactionId || "N/A"}</span>
                            {payment.stripePaymentIntentId && (
                              <span className="text-[9px] text-gray-400 font-mono" title="Stripe Intent">| INT: {payment.stripePaymentIntentId}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge className={`rounded-md font-bold text-[9px] uppercase px-2 py-0.5 ${
                          payment.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-amber-50 text-amber-600 border-none'
                        }`}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                        <Receipt className="w-10 h-10 text-gray-200" />
                        <p className="text-xs font-bold uppercase tracking-widest">No billing history available</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, allPayments.length)} of {allPayments.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="h-4 w-44 rounded-full bg-gray-200" />
        <div className="h-7 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-4 w-32 rounded-full bg-gray-200" />
          <div className="h-56 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-xl bg-gray-100" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-4 w-36 rounded-full bg-gray-200" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="h-5 w-40 rounded-full bg-gray-200" />
                <div className="h-4 w-full rounded-full bg-gray-100" />
                <div className="h-4 w-5/6 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
