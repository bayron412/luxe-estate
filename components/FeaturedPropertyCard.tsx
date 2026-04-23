import React from 'react';
import Link from 'next/link';
import { FeaturedProperty } from '../types/property';

export default function FeaturedPropertyCard({ property, dict }: { property: FeaturedProperty, dict?: any }) {
  return (
    <Link href={`/propiedades/${property.slug}`} className="block">
      <div className="group relative rounded-2xl overflow-hidden shadow-soft bg-white dark:bg-white/5 cursor-pointer h-full transition-all duration-500 hover:shadow-soft-hover">
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          <img
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={property.images[0]}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-nordic shadow-sm">
            {property.statusTag || "New Arrival"}
          </div>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic hover:bg-primary hover:text-white transition-all shadow-sm">
            <span className="material-symbols-rounded text-xl">favorite_border</span>
          </button>
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-medium text-nordic group-hover:text-primary transition-colors tracking-tight">
                {property.title}
              </h3>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-2 font-medium">
                <span className="material-symbols-rounded text-base text-primary">place</span> {property.location}
              </p>
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">{property.price}</span>
          </div>
          
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2.5 text-gray-500 text-sm font-semibold">
              <span className="material-symbols-rounded text-xl text-primary/40">king_bed</span> {property.beds} {dict?.beds || "Beds"}
            </div>
            <div className="flex items-center gap-2.5 text-gray-500 text-sm font-semibold">
              <span className="material-symbols-rounded text-xl text-primary/40">bathtub</span> {property.baths} {dict?.baths || "Baths"}
            </div>
            <div className="flex items-center gap-2.5 text-gray-500 text-sm font-semibold">
              <span className="material-symbols-rounded text-xl text-primary/40">square_foot</span> {property.area}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
