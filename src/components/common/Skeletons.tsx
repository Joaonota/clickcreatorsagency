import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 animate-pulse flex flex-col gap-4">
      <div className="w-full h-48 bg-slate-800 rounded-xl" />
      <div className="w-1/3 h-4 bg-slate-800 rounded" />
      <div className="w-2/3 h-6 bg-slate-800 rounded" />
      <div className="w-full h-12 bg-slate-800/60 rounded-lg" />
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
