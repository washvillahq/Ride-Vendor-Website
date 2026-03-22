import React from 'react';

const SpecsGrid = ({ specs = {} }) => {
  const specItems = [
    { label: 'Mileage', value: specs.mileage ? `${specs.mileage.toLocaleString()} km` : '42,000 km' },
    { label: 'Engine', value: specs.engine || '3.5L V6' },
    { label: 'Transmission', value: specs.transmission || 'Automatic' },
    { label: 'Fuel Type', value: specs.fuelType || 'Petrol' },
    { label: 'Color', value: specs.color || 'Graphite Gray' },
    { label: 'Condition', value: specs.condition || 'Tokunbo' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-slate-900">Vehicle Specifications</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 border-t border-slate-100 pt-8">
        {specItems.map((spec, i) => (
          <div key={i} className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {spec.label}
            </label>
            <p className="text-sm font-black text-slate-900 leading-tight">
              {spec.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecsGrid;
