import React from "react";

interface RequirementBadgeProps {
  icon: any;
  text: string;
  color: string;
}

export function LoadingState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-3 border-[#85A1D1] border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Framework...</span>
    </div>
  );
}

export function RequirementBadge({ icon: Icon, text, color }: RequirementBadgeProps) {
  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${color} uppercase`}>
      <Icon className="w-3 h-3" /> {text}
    </div>
  );
}

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

export function InputGroup({ label, value, onChange, placeholder }: InputGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
        className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]" 
        placeholder={placeholder} 
      />
    </div>
  );
}

interface TextAreaGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  rows?: number;
}

export function TextAreaGroup({ label, value, onChange, placeholder, rows = 3 }: TextAreaGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} 
        rows={rows} 
        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1] resize-none" 
        placeholder={placeholder} 
      />
    </div>
  );
}

interface SelectGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { v: string; l: string }[];
}

export function SelectGroup({ label, value, onChange, options }: SelectGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <select 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)} 
        className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold text-gray-900 outline-none focus:ring-1 focus:ring-[#85A1D1]"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ToggleButton({ label, active, onToggle, disabled }: ToggleButtonProps) {
  return (
    <label 
      className={`flex items-center gap-3 group ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      onClick={() => {
        if (!disabled) onToggle();
      }}
    >
      <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${active ? 'bg-[#85A1D1]' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <span className="text-xs font-bold text-gray-500">{label}</span>
    </label>
  );
}
