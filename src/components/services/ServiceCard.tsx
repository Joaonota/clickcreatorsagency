import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Service } from "../../data/services";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="glass-card group p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-zinc-800 hover:border-lime-400/50">
      {/* Background Image Accent on Hover */}
      <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-25 transition-opacity duration-500">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="relative z-10">
        {/* Top Header Row: Number + Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-3xl font-extrabold text-lime-400 group-hover:text-lime-300">
            {service.number}
          </span>
          <span className="w-8 h-0.5 bg-lime-400/40 group-hover:w-16 transition-all duration-300" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-lime-300 transition-colors">
          {service.title}
        </h3>

        {/* Short Description */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-6">
          {service.shortDescription}
        </p>
      </div>

      {/* Footer Link */}
      <div className="relative z-10 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link
          to={`/servicos/${service.slug}`}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white group-hover:text-lime-400 transition-colors"
        >
          <span>Saber mais</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};
