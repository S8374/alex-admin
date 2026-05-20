"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  CreditCard, DollarSign, ArrowUp, ArrowDown, 
  Search, Filter, Download, MoreHorizontal, User, 
  Calendar, CheckCircle2, AlertCircle, Clock, ExternalLink,
  ArrowUpRight, X, ChevronDown, ChevronUp, Dog
} from "lucide-react";
import { useGetAllPaymentsQuery, useGetPaymentStatsQuery } from "@/redux/api/PaymentApi";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

export function PaymentManagementView() {
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { data: statsRes, isLoading: statsLoading } = useGetPaymentStatsQuery(undefined);
  const { data: paymentsRes, isLoading: paymentsLoading } = useGetAllPaymentsQuery({ page, limit: 10 });

  const stats = statsRes?.data;
  const paymentsData = paymentsRes?.data;
  const payments = paymentsData?.payments || [];

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  if (statsLoading || paymentsLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Financial Data...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Payment Management</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue & Transaction Tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-100">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`} 
          trend="+12.5%" 
          trendUp={true}
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={ArrowUpRight} 
          label="Total Transactions" 
          value={stats?.totalTransactions?.toString() || '0'} 
          trend="+5.2%" 
          trendUp={true}
          color="bg-[#85A1D1]" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Success Rate" 
          value="98.2%" 
          trend="+0.4%" 
          trendUp={true}
          color="bg-indigo-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Pending Payouts" 
          value="$2,450" 
          trend="-2.1%" 
          trendUp={false}
          color="bg-amber-500" 
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by transaction ID, customer or email..." 
              className="w-full h-11 bg-gray-50 border-none rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1] transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFilterOpen(true)}
              className="h-11 px-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-100"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {payments.map((p: any) => (
                <React.Fragment key={p.id}>
                  <tr 
                    onClick={() => toggleRow(p.id)}
                    className={`hover:bg-gray-50/50 transition-colors group cursor-pointer ${expandedRows.includes(p.id) ? 'bg-gray-50/80' : ''}`}
                  >
                    <td className="px-6 py-5">
                      {expandedRows.includes(p.id) ? <ChevronUp className="w-4 h-4 text-[#85A1D1]" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 font-mono mb-1">#{p.transactionId?.slice(-8).toUpperCase() || 'TXN-0000'}</span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(new Date(p.createdAt), "MMM dd, yyyy · HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          {p.user?.avatarUrl ? <img src={p.user.avatarUrl} className="w-full h-full rounded-full" alt="" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900">{p.user?.fullName || "Anonymous"}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{p.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {p.coveredPets?.length > 0 ? (
                          p.coveredPets.map((pet: any) => (
                            <Badge key={pet.id} className="bg-[#85A1D1]/10 text-[#85A1D1] border-none text-[9px] font-black uppercase py-0.5">
                              {pet.name} (${pet.petCharge || '0'})
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold italic uppercase tracking-wider">No pets found</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 mb-1">${p.amount.toLocaleString()}</span>
                        <Badge className="w-fit bg-gray-100 text-gray-500 border-none text-[9px] font-bold uppercase py-0.5">{p.type?.replace("_", " ")}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">${p.monthlyPremium?.toLocaleString() || '0'}/mo</span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Auto-Connect Premium</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); toast.info("Viewing details for " + p.transactionId); }} className="p-2 text-gray-400 hover:text-[#85A1D1] transition-colors"><ExternalLink className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); toast.info("Opening actions for transaction"); }} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Pet Details */}
                  <AnimatePresence>
                    {expandedRows.includes(p.id) && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50/30"
                          >
                            <div className="p-8 border-l-4 border-[#85A1D1] ml-6 mb-6 mt-2 space-y-6">
                              <div className="flex items-center gap-3 mb-2">
                                <Dog className="w-5 h-5 text-[#85A1D1]" />
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Detailed Pet Coverage</h4>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {p.coveredPets?.map((pet: any) => (
                                  <div key={pet.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#85A1D1]">
                                          <Dog className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-bold text-gray-900">{pet.name}</h5>
                                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{pet.species || 'Dog'} · {pet.gender}</span>
                                        </div>
                                      </div>
                                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black py-1">
                                        ${pet.petCharge || '0'}/mo
                                      </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-1">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Breed</p>
                                        <p className="text-[11px] font-bold text-gray-700">{pet.primaryBreed}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Birthday</p>
                                        <p className="text-[11px] font-bold text-gray-700">{pet.birthday ? format(new Date(pet.birthday), "MMM dd, yyyy") : 'Not set'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Status</p>
                                        <Badge className="bg-gray-100 text-gray-500 border-none text-[8px] font-black uppercase py-0.5">{pet.status}</Badge>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Microchip</p>
                                        <p className="text-[11px] font-bold text-gray-700">{pet.microchipNumber || 'No ID'}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
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

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Showing <span className="text-gray-900">{payments.length}</span> of <span className="text-gray-900">{paymentsData?.pagination?.total || 0}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 h-9 bg-gray-50 text-gray-500 rounded-lg font-bold text-xs hover:bg-gray-100 disabled:opacity-50 transition-all border border-gray-100"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (paymentsData?.pagination?.totalPages || 1)}
              className="px-4 h-9 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black disabled:opacity-50 transition-all shadow-md shadow-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Status</label>
                  <select className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]">
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Type</label>
                  <select className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]">
                    <option value="ALL">All Types</option>
                    <option value="SETUP_FEE">Setup Fee</option>
                    <option value="MONTHLY_PREMIUM">Monthly Premium</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setFilterOpen(false)} className="flex-1 h-12 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all">Reset</button>
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

function StatCard({ icon: Icon, label, value, trend, trendUp, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#85A1D1]/30 transition-all cursor-default">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black ${trendUp ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-tighter`}>
            {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
        </div>
      </div>
      <Icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-gray-50 group-hover:text-gray-100/50 transition-all rotate-12" />
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
    <Badge className={`px-2 py-1 ${styles[status] || 'bg-gray-50 text-gray-500'} border flex items-center gap-1.5 w-fit text-[10px] font-black uppercase tracking-tighter`}>
      <Icon className="w-3 h-3" /> {status}
    </Badge>
  );
}
