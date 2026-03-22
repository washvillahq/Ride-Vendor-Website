import React from 'react';
import Skeleton from '../../../components/ui/Skeleton';
import { Card, CardContent } from '../../../components/ui/Card';

const CarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 p-6 space-y-6">
      <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-7 w-full" />
        </div>
        <div className="space-y-2">
           <Skeleton className="h-3 w-10" />
           <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-3 pt-2">
           <Skeleton className="h-14 flex-1 rounded-2xl" />
           <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default CarCardSkeleton;
