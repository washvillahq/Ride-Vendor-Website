import { Users, Settings2, Fuel, Wind } from 'lucide-react';

const SpecsGrid = ({ specs = {} }) => {
  const specItems = [
    { label: 'Seater', value: specs.seatingCapacity ? `${specs.seatingCapacity}-Seater` : '7-Seater', icon: Users },
    { label: 'Transmission', value: specs.transmission || 'Automatic', icon: Settings2 },
    { label: 'Fuel', value: specs.fuelType || 'Petrol', icon: Fuel },
    { label: 'Climate Control', value: 'Full AC', icon: Wind },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specItems.map((spec, i) => (
        <div key={i} className="bg-slate-50/80 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100">
           <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <spec.icon className="w-5 h-5 text-slate-400" />
           </div>
           <div className="space-y-1">
              <p className="text-[#1A2B3D] text-[13px] font-bold">{spec.value}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{spec.label}</p>
           </div>
        </div>
      ))}
    </div>
  );
};

export default SpecsGrid;
