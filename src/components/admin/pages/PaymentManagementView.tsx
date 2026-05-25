"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Dog,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useGetAllPaymentsQuery, useGetPaymentStatsQuery } from "@/redux/api/PaymentApi";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

const PAGE_SIZE = 8;
const ALL_STATUS = "ALL";

export function PaymentManagementView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_STATUS);
  const [typeFilter, setTypeFilter] = useState(ALL_STATUS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const { data: statsRes, isLoading: statsLoading } = useGetPaymentStatsQuery(undefined);
  const { data: paymentsRes, isLoading: paymentsLoading } = useGetAllPaymentsQuery({ page: 1, limit: 500 });

  const allPayments = paymentsRes?.data?.payments || [];
  const paymentStats = useMemo(() => {
    const derived = calculatePaymentStats(allPayments);
    const apiStats = statsRes?.data || {};

    return {
      totalRevenue: Number(apiStats.totalRevenue ?? derived.totalRevenue ?? 0),
      totalTransactions: Number(apiStats.totalTransactions ?? derived.totalTransactions ?? 0),
      successRate: Number(apiStats.successRate ?? derived.successRate ?? 0),
      totalMonthlyCharge: Number(apiStats.totalMonthlyCharge ?? derived.totalMonthlyCharge ?? 0),
    };
  }, [allPayments, statsRes?.data]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allPayments.filter((payment: any) => {
      const matchesSearch =
        !query ||
        payment.transactionId?.toLowerCase().includes(query) ||
        payment.user?.fullName?.toLowerCase().includes(query) ||
        payment.user?.email?.toLowerCase().includes(query) ||
        payment.coveredPets?.some((pet: any) => pet.name?.toLowerCase().includes(query));

      const matchesStatus = statusFilter === ALL_STATUS || payment.status === statusFilter;
      const matchesType = typeFilter === ALL_STATUS || payment.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allPayments, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(filteredPayments.length, startIndex + PAGE_SIZE);
  const visiblePayments = filteredPayments.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
    setExpandedRows([]);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const loading = statsLoading || paymentsLoading;

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Financial Data...</span>
      </div>
    );
  }

  const statCards = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${paymentStats.totalRevenue.toLocaleString()}`,
      subtitle: "Successful payments",
      color: "bg-emerald-500",
    },
    {
      icon: ArrowUpRight,
      label: "Total Transactions",
      value: paymentStats.totalTransactions.toLocaleString(),
      subtitle: "All payment records",
      color: "bg-[#85A1D1]",
    },
    {
      icon: CheckCircle2,
      label: "Success Rate",
      value: `${paymentStats.successRate.toFixed(1)}%`,
      subtitle: "Success / total ratio",
      color: "bg-indigo-500",
    },
    {
      icon: Clock,
      label: "Total Monthly Charge",
      value: `$${paymentStats.totalMonthlyCharge.toLocaleString()}/mo`,
      subtitle: "All covered pets",
      color: "bg-amber-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight wrap-break-word">Payment Management</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider wrap-break-word">Revenue & Transaction Tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => toast.info("Export report is not wired yet")}
            className="h-10 w-full md:w-auto px-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-100"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} subtitle={card.subtitle} color={card.color} />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by transaction ID, customer or email..."
                className="w-full h-11 bg-gray-50 border-none rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1] transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="h-11 w-full sm:w-auto px-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-100"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100">{filteredPayments.length} matching</span>
            <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100">Page {safePage} of {totalPages}</span>
          </div>
        </div>

        <div className="lg:hidden p-4">
          {visiblePayments.length ? (
            <div className="space-y-3">
              {visiblePayments.map((payment: any) => (
                <MobilePaymentCard
                  key={payment.id}
                  payment={payment}
                  expanded={expandedRows.includes(payment.id)}
                  onToggle={() => toggleRow(payment.id)}
                  onView={() => toast.info(`Viewing details for ${payment.transactionId || payment.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-300">
              <p className="text-sm font-medium">No payments found</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-275">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="w-10 px-6 py-4"></th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction / Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pets Covered</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visiblePayments.map((payment: any) => (
                <React.Fragment key={payment.id}>
                  <tr
                    onClick={() => toggleRow(payment.id)}
                    className={`hover:bg-gray-50/50 transition-colors group cursor-pointer ${expandedRows.includes(payment.id) ? "bg-gray-50/80" : ""}`}
                  >
                    <td className="px-6 py-5">
                      {expandedRows.includes(payment.id) ? <ChevronUp className="w-4 h-4 text-[#85A1D1]" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 font-mono mb-1">#{payment.transactionId?.slice(-8).toUpperCase() || "TXN-0000"}</span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(new Date(payment.createdAt), "MMM dd, yyyy · HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                          {payment.user?.avatarUrl ? <img src={payment.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-gray-900 truncate">{payment.user?.fullName || "Anonymous"}</span>
                          <span className="text-[10px] text-gray-400 font-medium truncate">{payment.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1 max-w-55">
                        {payment.coveredPets?.length > 0 ? (
                          payment.coveredPets.map((pet: any) => (
                            <Badge key={pet.id} className="bg-[#85A1D1]/10 text-[#85A1D1] border-none text-[9px] font-black uppercase py-0.5">
                              {pet.name} (${pet.petCharge || "0"})
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold italic uppercase tracking-wider">No pets found</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 mb-1">${Number(payment.amount || 0).toLocaleString()}</span>
                        <Badge className="w-fit bg-gray-100 text-gray-500 border-none text-[9px] font-bold uppercase py-0.5">{payment.type?.replace("_", " ")}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">${Number(payment.monthlyPremium || 0).toLocaleString()}/mo</span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Auto-Connect Premium</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); toast.info(`Viewing details for ${payment.transactionId || payment.id}`); }} className="p-2 text-gray-400 hover:text-[#85A1D1] transition-colors"><ExternalLink className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); toast.info("Opening actions for transaction"); }} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>

                  <AnimatePresence>
                    {expandedRows.includes(payment.id) && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50/30"
                          >
                            <div className="p-8 border-l-4 border-[#85A1D1] ml-6 mb-6 mt-2 space-y-6">
                              <PetCoverageTable pets={payment.coveredPets || []} totalMonthlyFee={Number(payment.monthlyPremium || 0)} />
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Showing <span className="text-gray-900">{filteredPayments.length ? startIndex + 1 : 0}</span> to <span className="text-gray-900">{endIndex}</span> of <span className="text-gray-900">{filteredPayments.length}</span> results
          </p>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage === 1}
              className="px-4 h-9 bg-gray-50 text-gray-500 rounded-lg font-bold text-xs hover:bg-gray-100 disabled:opacity-50 transition-all border border-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage >= totalPages}
              className="px-4 h-9 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black disabled:opacity-50 transition-all shadow-md shadow-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]">
                    <option value={ALL_STATUS}>All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]">
                    <option value={ALL_STATUS}>All Types</option>
                    <option value="SETUP_FEE">Setup Fee</option>
                    <option value="MONTHLY_PREMIUM">Monthly Premium</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter(ALL_STATUS);
                      setTypeFilter(ALL_STATUS);
                      setPage(1);
                      setFilterOpen(false);
                    }}
                    className="flex-1 h-12 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all"
                  >
                    Reset
                  </button>
                  <button onClick={() => setFilterOpen(false)} className="flex-2 px-10 h-12 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all">Apply Filters</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobilePaymentCard({ payment, expanded, onToggle, onView }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full p-4 flex items-start justify-between gap-3 text-left">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
            {payment.user?.avatarUrl ? <img src={payment.user.avatarUrl} className="w-full h-full rounded-xl object-cover" alt="" /> : <User className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-900 truncate">{payment.user?.fullName || "Anonymous"}</p>
              <StatusBadge status={payment.status} />
            </div>
            <p className="text-[11px] text-gray-400 font-medium truncate">{payment.user?.email}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-900 font-mono">#{payment.transactionId?.slice(-8).toUpperCase() || "TXN-0000"}</span>
                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-gray-900">${Number(payment.amount || 0).toLocaleString()}</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{payment.type?.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expanded ? "rotate-180" : "rotate-0"}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
            <div className="p-4 space-y-4 bg-gray-50/60">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Dog className="w-4 h-4 text-[#85A1D1] shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">Pet Coverage</p>
                </div>
                <button onClick={onView} className="h-8 px-3 rounded-lg bg-white border border-gray-100 text-[10px] font-bold text-gray-700">
                  Details
                </button>
              </div>

              <PetCoverageTable pets={payment.coveredPets || []} totalMonthlyFee={Number(payment.monthlyPremium || 0)} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PetCoverageTable({ pets, totalMonthlyFee, compact = false }: { pets: any[]; totalMonthlyFee: number; compact?: boolean }) {
  const totalPets = pets.length;
  const computedTotalFee = pets.reduce((sum, pet) => sum + Number(pet.petCharge || 0), 0);
  const displayTotalFee = totalMonthlyFee > 0 ? totalMonthlyFee : computedTotalFee;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-gray-100 p-4">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Pets</p>
          <p className="text-xl font-black text-gray-900">{totalPets}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Monthly Fee</p>
          <p className="text-xl font-black text-gray-900">${displayTotalFee.toLocaleString()}/mo</p>
        </div>
      </div>

      {pets.length ? (
        <div className={`${compact ? "bg-white border border-gray-100 rounded-2xl overflow-hidden" : "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left border-collapse">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Pet</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Breed</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Birthday</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Monthly Charge</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Microchip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#85A1D1] shrink-0">
                          <Dog className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{pet.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">{pet.species || "Dog"} · {pet.gender || "Unknown"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-700 wrap-break-word">{pet.primaryBreed || "Unknown"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-700">{pet.birthday ? format(new Date(pet.birthday), "MMM dd, yyyy") : "Not set"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-gray-100 text-gray-500 border-none text-[9px] font-black uppercase py-0.5">{pet.status || "ACTIVE"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black py-1">
                        ${Number(pet.petCharge || 0).toLocaleString()}/mo
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-bold text-gray-700">{pet.microchipNumber || "No ID"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-gray-400">No pet details found for this payment.</p>
        </div>
      )}
    </div>
  );
}

function calculatePaymentStats(payments: any[]) {
  const totalTransactions = payments.length;
  const successfulPayments = payments.filter((payment) => payment.status === "SUCCESS");

  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalMonthlyCharge = payments.reduce((sum, payment) => sum + Number(payment.monthlyPremium || 0), 0);
  const successRate = totalTransactions ? (successfulPayments.length / totalTransactions) * 100 : 0;

  return {
    totalRevenue,
    totalTransactions,
    successRate,
    totalMonthlyCharge,
  };
}

function StatCard({ icon: Icon, label, value, subtitle, color }: any) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#85A1D1]/30 transition-all cursor-default">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter text-right wrap-break-word">{subtitle}</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight wrap-break-word">{value}</h3>
        </div>
      </div>
      <Icon className="absolute -right-2.5 -bottom-2.5 w-24 h-24 text-gray-50 group-hover:text-gray-100/50 transition-all rotate-12" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    SUCCESS: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const icons: any = {
    SUCCESS: CheckCircle2,
    PENDING: Clock,
    FAILED: AlertCircle,
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <Badge className={`px-2 py-1 ${styles[status] || "bg-gray-50 text-gray-500"} border flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-tighter`}>
      <Icon className="w-3 h-3" /> {status}
    </Badge>
  );
}
