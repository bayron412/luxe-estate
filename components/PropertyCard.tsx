import React from 'react';
import Link from 'next/link';
import { Property } from '../types/property';

export default function PropertyCard({ property, dict }: { property: Property, dict?: any }) {
  return (
    <Link href={`/propiedades/${property.slug}`} className="block h-full">
      <article className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={property.images[0]}
          />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic hover:bg-primary hover:text-white transition-all shadow-sm">
            <span className="material-symbols-rounded text-xl">favorite_border</span>
          </button>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-nordic shadow-sm">
            {property.statusTag || "New Arrival"}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="overflow-hidden pr-4">
              <h4 className="text-xl font-medium text-nordic group-hover:text-primary transition-colors truncate tracking-tight">{property.title}</h4>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1 font-medium">
                <span className="material-symbols-rounded text-sm text-primary">place</span> {property.location}
              </p>
            </div>
            <span className="text-xl font-semibold text-primary whitespace-nowrap tracking-tight">{property.price}</span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
              <span className="material-symbols-rounded text-base text-primary/40">king_bed</span> {property.beds}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
              <span className="material-symbols-rounded text-base text-primary/40">bathtub</span> {property.baths}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
              <span className="material-symbols-rounded text-base text-primary/40">square_foot</span> {property.area}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
