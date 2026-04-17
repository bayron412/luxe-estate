import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "../../../../components/Navbar";
import { supabase } from "../../../../lib/supabase";
import { Property } from "../../../../types/property";
import PropertyMapWrapper from "../../../../components/PropertyMapWrapper";
import { getDictionary } from "../../../../lib/dictionary";


export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

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
    <div className="bg-[#EEF6F6] text-nordic font-display antialiased selection:bg-mosque/20 min-h-screen">
      <Navbar dict={dict.navbar} lang={lang} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Photos and Main Content section */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <Image
                alt={property.title}
                src={mainImage}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  {property.statusTag}
                </span>
                {property.isRental && (
                  <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {dict.property.rental}
                  </span>
                )}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                <span className="material-icons text-sm">grid_view</span>
                {dict.property.viewAllPhotos}
              </button>
            </div>

            {/* Thumbnail Gallery Row */}
            {galleryImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 snap-x">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity snap-start relative">
                    <Image
                      alt={`Gallery view ${idx + 1}`}
                      src={img}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Pricing, Agent, Call to Action */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic mb-2">{property.price}</h1>
                  <p className="text-nordic/60 font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 my-6"></div>
                <div className="flex items-center gap-4 mb-6">
                  {/* Dummy Agent - in a real app this would come from DB */}
                  <img 
                    alt="Sarah Jenkins" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                  />
                  <div>
                    <h3 className="font-semibold text-nordic">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{dict.property.topRatedAgent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-[#005544] text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    {dict.property.scheduleVisit}
                  </button>
                  <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    {dict.property.contactAgent}
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <PropertyMapWrapper location={property.location} lat={property.lat} lng={property.lng} />
              </div>
            </div>
          </div>
          
          {/* Scrollable details under images */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-4 lg:-mt-8 space-y-8 pb-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic">{dict.property.propertyFeatures}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic">{property.area}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">{dict.property.space}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">{dict.property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">{dict.property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                  <span className="text-xl font-bold text-nordic">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">{dict.property.garage}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic">{dict.property.aboutHome}</h2>
              <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
                <h2 className="text-lg font-semibold mb-6 text-nordic">{dict.property.amenities}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-nordic/70">
                      <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                      <span>
                        {(dict.property.amenitiesMap as Record<string, string>)?.[amenity] || amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50">
            © 2026 LuxeEstate Inc. {dict.property.allRightsReserved}
          </div>
        </div>
      </footer>
    </div>
  );
}
