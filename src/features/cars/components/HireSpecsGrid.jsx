import { Users, Settings2, Fuel, Snowflake } from 'lucide-react';

const HireSpecsGrid = ({ specs = {} }) => {
  const specItems = [
    { value: specs.seatingCapacity ? `${specs.seatingCapacity}-Seater` : '7-Seater', icon: Users },
    { value: specs.transmission || 'Automatic', icon: Settings2 },
    { value: specs.fuelType || 'Petrol', icon: Fuel },
    { value: 'Climate Control', icon: Snowflake },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specItems.map((spec, i) => (
        <div key={i} className="bg-[#F4F3F5] p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100">
          <spec.icon className="w-8 h-8 text-[#002E3E] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <p className="text-[#41484B] text-sm font-bold tracking-tight">{spec.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HireSpecsGrid;
