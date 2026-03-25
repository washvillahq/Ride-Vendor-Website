import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

const InspectionReport = () => {
  const points = [
    "Engine & Transmission",
    "Electrical Systems",
    "Accident History",
    "Suspension & Braking"
  ];

  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 space-y-10">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-medium text-slate-900 tracking-tight">360° Inspection Report</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-medium text-green-600">9.2</span>
          <span className="text-[10px] font-medium text-slate-400">/10</span>
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-green-600 w-[92%] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, i) => (
          <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-600/10" />
            <span className="text-[11px] font-medium text-slate-900 tracking-tight uppercase">{point}</span>
          </div>
        ))}
      </div>

      <a href="#" className="inline-flex items-center gap-3 text-[10px] font-medium text-accent-dark uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-accent-dark pb-1">
        <Download className="w-4 h-4" />
        Download Full PDF Inspection Report
      </a>
    </div>
  );
};

export default InspectionReport;
