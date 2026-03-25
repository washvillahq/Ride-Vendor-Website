import RentalSearchBar from './RentalSearchBar';

const RentalHero = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <div className="space-y-2 md:space-y-4">
        <h1 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Premium Car Hire for Every Occasion.
        </h1>
        <div className="h-1.5 w-20 bg-accent rounded-full" />
      </div>

      <RentalSearchBar />
    </div>
  );
};

export default RentalHero;
