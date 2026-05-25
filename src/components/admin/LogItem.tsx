import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCcw } from "lucide-react";

interface LogItemProps {
  log: any;
  onDelete?: () => void;
  icon: any;
  colorClass: string;
}

export function LogItem({ log, onDelete, icon: Icon, colorClass }: LogItemProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass.split(' ')[0].replace('text', 'bg')}`} />
        
        {onDelete && (
          <button 
            onClick={onDelete}
            className="absolute right-4 top-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex gap-4">
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${colorClass}`}>
                {log.level}
              </span>
            </div>
            
            <p className="text-sm font-bold text-gray-900 leading-snug">
              {log.message.replace(/🛡️ SECURITY: |✅ |⚙ /g, '')}
            </p>

            {log.details && Object.keys(log.details).length > 0 && (
              <div className="pt-2 space-y-2">
                {Object.entries(log.details).map(([key, value]: [string, any]) => {
                  let displayValue = value;
                  let isJson = false;
                  
                  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                    try {
                      displayValue = JSON.parse(value);
                      isJson = true;
                    } catch (e) {
                      displayValue = value;
                    }
                  }

                  const jsonString = isJson ? JSON.stringify(displayValue, null, 2) : String(value);
                  const shouldTruncate = isJson && jsonString.length > 300;

                  return (
                    value && (
                      <div key={key} className={`flex flex-col gap-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 max-w-full ${isJson ? 'w-full' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{key}</span>
                          {shouldTruncate && (
                            <button 
                              onClick={() => setShowModal(true)}
                              className="text-[9px] font-black text-[#85A1D1] hover:underline uppercase"
                            >
                              Show Full Response
                            </button>
                          )}
                        </div>
                        <pre className={`text-[10px] font-bold text-gray-700 wrap-break-word whitespace-pre-wrap leading-relaxed ${isJson ? 'font-mono bg-white p-3 rounded-lg border border-gray-100' : ''} ${shouldTruncate ? 'max-h-24 overflow-hidden' : ''}`}>
                          {jsonString}
                        </pre>
                        {shouldTruncate && (
                          <div className="h-4 bg-linear-to-t from-white to-transparent -mt-4 relative z-10" />
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* JSON Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10 gap-4">
                <div>
                  <h3 className="font-black text-gray-900">Full JSON Response</h3>
                  <p className="text-xs text-gray-500 font-medium">{log.message}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <RefreshCcw className="w-5 h-5 rotate-45" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50 custom-scrollbar">
                {Object.entries(log.details).map(([key, value]: [string, any]) => {
                   let displayValue = value;
                   if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                     try { displayValue = JSON.parse(value); } catch (e) {}
                   }
                   return (
                     <div key={key} className="space-y-4">
                       <div className="flex items-center gap-2">
                         <div className="h-4 w-1 bg-[#85A1D1] rounded-full" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                       </div>
                       <pre className="text-xs font-bold text-gray-700 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 font-mono overflow-x-auto shadow-sm">
                         {JSON.stringify(displayValue, null, 2)}
                       </pre>
                     </div>
                   );
                })}
              </div>
              <div className="p-6 border-t border-gray-50 bg-white flex justify-end">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                >
                  Close Viewer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
