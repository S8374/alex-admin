import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, GitBranch, Settings, X, Save, Loader2 } from "lucide-react";
import { InputGroup, TextAreaGroup, SelectGroup, ToggleButton } from "./UIElements";

interface QuestionnaireModalProps {
  isOpen: boolean;
  type: string;
  formData: any;
  setFormData: (data: any) => void;
  onClose: () => void;
  onSave: () => void;
  isPending: boolean;
}

export function QuestionnaireModal({ 
  isOpen, 
  type, 
  formData, 
  setFormData, 
  onClose, 
  onSave, 
  isPending 
}: QuestionnaireModalProps) {
  const isQuestion = type.includes("question") || type.includes("nested");
  const isEdit = type.includes("edit");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#85A1D1]/10 rounded-2xl flex items-center justify-center text-[#85A1D1]">
                    {type.includes("question") ? <HelpCircle className="w-6 h-6" /> : type.includes("nested") ? <GitBranch className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">
                      {type === "init" && "Initialize Framework"}
                      {type === "edit-main" && "Update Framework"}
                      {type === "add-question" && "New Question"}
                      {type === "edit-question" && "Edit Question"}
                      {type === "add-nested" && "Attach Logic"}
                      {type === "edit-nested" && "Edit Logic"}
                    </h2>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Configure parameters</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                {(type === "init" || type === "edit-main") && (
                  <>
                    <InputGroup label="Topic Title" value={formData.topicTitle} onChange={(val: string) => setFormData({ ...formData, topicTitle: val })} placeholder="Health Assessment 2026" />
                    <TextAreaGroup label="Description" value={formData.description} onChange={(val: string) => setFormData({ ...formData, description: val })} placeholder="Purpose of this assessment..." rows={4} />
                    <TextAreaGroup label="HIPAA Disclaimer Text" value={formData.disclaimerText || ""} onChange={(val: string) => setFormData({ ...formData, disclaimerText: val })} placeholder="Enter HIPAA disclaimer or policy text..." rows={6} />
                    <InputGroup label="Disclaimer Checkbox Label" value={formData.disclaimerLabel || ""} onChange={(val: string) => setFormData({ ...formData, disclaimerLabel: val })} placeholder="e.g. I acknowledge that I have read, understood..." />
                  </>
                )}

                {isQuestion && (
                  <>
                    <TextAreaGroup label="Question Text" value={formData.questionText} onChange={(val: string) => setFormData({ ...formData, questionText: val })} placeholder="Enter question..." rows={3} />
                    {type.includes("question") && (
                      <SelectGroup 
                        label="Category" 
                        value={formData.category} 
                        onChange={(val: string) => {
                          const isRequired = val === "HEALTH" || val === "CANCER";
                          setFormData({ 
                            ...formData, 
                            category: val, 
                            isInputRequired: isRequired ? true : formData.isInputRequired 
                          });
                        }} 
                        options={[{v:"HEALTH", l:"Health"}, {v:"CANCER", l:"Cancer"}, {v:"NORMAL", l:"Normal"}]} 
                      />
                    )}
                    <div className="flex items-center gap-8 pt-2">
                      <ToggleButton 
                        label="Input Required" 
                        active={formData.isInputRequired} 
                        onToggle={() => setFormData({ ...formData, isInputRequired: !formData.isInputRequired })} 
                        disabled={formData.category === "HEALTH" || formData.category === "CANCER"}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-gray-50 flex gap-3">
                <button onClick={onClose} className="flex-1 h-12 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all">Cancel</button>
                <button onClick={onSave} disabled={isPending} className="flex-2 px-10 h-12 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEdit ? "Save Changes" : "Confirm & Add"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
