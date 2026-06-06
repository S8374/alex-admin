"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetSentQuotesQuery, useDeleteQuoteMutation } from "@/redux/api/quoteApi";
import { toast } from "sonner";
import { Trash2, FileSpreadsheet, PawPrint, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SentQuotesView({ userId }: { userId?: string }) {
  const { data: quotesResponse, isLoading } = useGetSentQuotesQuery(undefined);
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation();

  const allQuotes = quotesResponse?.data || [];
  const quotes = userId ? allQuotes.filter((q: any) => q.userId === userId) : allQuotes;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        await deleteQuote(id).unwrap();
        toast.success("Quote deleted successfully");
      } catch (error) {
        toast.error("Failed to delete quote");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={userId ? "space-y-4" : "space-y-6"}>
      {!userId && (
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Sent Quotes</h1>
          <p className="text-gray-500 text-sm font-medium">Review and manage all sent quotes</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.length > 0 ? (
          quotes.map((quote: any) => (
            <div key={quote.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Quote</h3>
                    <p className="text-xs text-gray-500">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={quote.isAccepted ? "default" : quote.isRejected ? "destructive" : "secondary"}>
                  {quote.isAccepted ? "Accepted" : quote.isRejected ? "Rejected" : "Pending"}
                </Badge>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{quote.user?.fullName} ({quote.user?.email})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <PawPrint className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{quote.pet?.name} ({quote.pet?.species})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Setup Fee</p>
                  <p className="font-bold text-gray-900">${Number(quote.setupFee || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Monthly Charge</p>
                  <p className="font-bold text-primary">${Number(quote.monthlyCharge || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                {(quote.payments && quote.payments.length > 0) ? (
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md font-medium">
                    💳 Payment made — cannot delete
                  </div>
                ) : (
                  <Button
                    onClick={() => handleDelete(quote.id)}
                    variant="ghost"
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-xs px-3"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Quote
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No quotes found</h3>
            <p className="text-gray-500 text-sm mt-1">There are currently no sent quotes.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
