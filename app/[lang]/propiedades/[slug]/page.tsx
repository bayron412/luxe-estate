import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "../../../../components/Navbar";
import { createClient } from "../../../../lib/supabase/server";
import { Property } from "../../../../types/property";
import PropertyMapWrapper from "../../../../components/PropertyMapWrapper";
import { getDictionary } from "../../../../lib/dictionary";


export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("title, description, images")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: 'Property Not Found' };
  }

  return {
    title: `${data.title} | LuxeEstate`,
    description: data.description,
    openGraph: {
      images: data.images ? data.images : [],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string, lang: 'es' | 'en' | 'fr' }>;
}) {
  const resolvedParams = await params;
  const { slug, lang } = resolvedParams;
  
  const dict = await getDictionary(lang);

  // Fetch the property
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !row) {
    notFound();
  }

  const property: Property = {
    id: row.id,
    title: row.title,
    price: row.price,
    location: row.location,
    beds: Number(row.beds),
    baths: Number(row.baths),
    area: row.area,
    lat: Number(row.lat),
    lng: Number(row.lng),
    images: row.images || [],
    description: row.description || "No description available.",
    amenities: row.amenities || [],
    slug: row.slug,
    isRental: row.is_rental,
    statusTag: row.status_tag,
  };

  const images = property.images && property.images.length > 0 ? property.images : [''];
  const mainImage = images[0];
  const galleryImages = images.slice(1);

  return (
    <div className="bg-background-light text-nordic font-display antialiased min-h-screen">
      <Navbar dict={dict.navbar} lang={lang} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Photos and Main Content section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft group">
              <Image
                alt={property.title}
                src={mainImage}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {property.statusTag || "For Sale"}
                </span>
                {property.isRental && (
                  <span className="bg-white/90 backdrop-blur-sm text-nordic text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {dict.property.rental}
                  </span>
                )}
              </div>
              <button className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-nordic px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl backdrop-blur-sm transition-all flex items-center gap-2 group">
                <span className="material-symbols-rounded text-lg group-hover:rotate-12 transition-transform">grid_view</span>
                {dict.property.viewAllPhotos}
              </button>
            </div>

            {/* Thumbnail Gallery Row */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {galleryImages.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-soft-hover transition-all relative group">
                    <Image
                      alt={`Gallery view ${idx + 1}`}
                      src={img}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Pricing, Agent, Call to Action */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-nordic/5 space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-nordic tracking-tight mb-2">{property.price}</h1>
                <p className="text-gray-500 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-primary text-xl">location_on</span>
                  {property.location}
                </p>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    alt="Sarah Jenkins" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-soft" 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-nordic truncate">Sarah Jenkins</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">
                    <span className="material-symbols-rounded text-sm">verified</span>
                    {dict.property.topRatedAgent}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-background-light text-nordic hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                    <span className="material-symbols-rounded text-xl">chat</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-background-light text-nordic hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                    <span className="material-symbols-rounded text-xl">call</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button className="w-full bg-primary hover:bg-primary-dark text-white py-5 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 group transform active:scale-[0.98]">
                  <span className="material-symbols-rounded text-xl group-hover:scale-110 transition-transform">calendar_month</span>
                  {dict.property.scheduleVisit}
                </button>
                <button className="w-full bg-white border-2 border-gray-100 hover:border-primary text-nordic hover:text-primary py-5 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.98]">
                  <span className="material-symbols-rounded text-xl">mail</span>
                  {dict.property.contactAgent}
                </button>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-2xl shadow-soft border border-nordic/5 overflow-hidden">
              <div className="rounded-xl overflow-hidden h-[300px]">
                <PropertyMapWrapper location={property.location} lat={property.lat} lng={property.lng} />
              </div>
            </div>
          </div>
          
          {/* Scrollable details under images */}
          <div className="lg:col-span-8 space-y-10 pb-20">
            <div className="space-y-6">
              <h2 className="text-[12px] font-bold text-nordic uppercase tracking-[0.2em]">{dict.property.propertyFeatures}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-rounded text-2xl">straighten</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{dict.property.space}</p>
                    <p className="text-base font-bold text-nordic leading-tight">{property.area}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-rounded text-2xl">bed</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{dict.property.bedrooms}</p>
                    <p className="text-base font-bold text-nordic leading-tight">{property.beds}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-rounded text-2xl">shower</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{dict.property.bathrooms}</p>
                    <p className="text-base font-bold text-nordic leading-tight">{property.baths}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-rounded text-2xl">directions_car</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{dict.property.garage}</p>
                    <p className="text-base font-bold text-nordic leading-tight">2</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-soft border border-nordic/5">
              <h2 className="text-xl font-bold text-nordic uppercase tracking-widest text-[12px] mb-6">{dict.property.aboutHome}</h2>
              <div className="prose prose-slate max-w-none text-gray-500 leading-relaxed whitespace-pre-line font-medium">
                {property.description}
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-10 rounded-3xl shadow-soft border border-nordic/5">
                <h2 className="text-xl font-bold text-nordic uppercase tracking-widest text-[12px] mb-8">{dict.property.amenities}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-gray-500 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <span className="material-symbols-rounded text-lg">check_circle</span>
                      </div>
                      <span className="text-sm">
                        {(dict.property.amenitiesMap as Record<string, string>)?.[amenity] || amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Payment */}
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl text-primary shadow-soft flex items-center justify-center">
                  <span className="material-symbols-rounded text-3xl">calculate</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-nordic">{dict.property.estimatedPayment}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {dict.property.startingFrom}{" "}
                    <strong className="text-primary font-bold text-base">$5,430/mo</strong>{" "}
                    {dict.property.withDownPayment}
                  </p>
                </div>
              </div>
              <button className="w-full md:w-auto px-8 py-4 bg-white border-2 border-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-primary transition-colors text-nordic shadow-soft transform active:scale-95">
                {dict.property.calculateMortgage}
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50">
            © 2026 LuxeEstate Inc. {dict.property.allRightsReserved}
          </div>
          <div className="flex gap-6">
            <a className="text-nordic/40 hover:text-mosque transition-colors" href="#">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a className="text-nordic/40 hover:text-mosque transition-colors" href="#">
              <span className="sr-only">Twitter / X</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
