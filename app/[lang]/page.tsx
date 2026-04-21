import React from "react";
import Navbar from "../../components/Navbar";
import FeaturedPropertyCard from "../../components/FeaturedPropertyCard";
import PropertyCard from "../../components/PropertyCard";
import Pagination from "../../components/Pagination/Pagination";
import SearchFilters from "../../components/SearchFilters";
import { getDictionary } from "../../lib/dictionary";
import { createClient } from "../../lib/supabase/server";
import { Property, FeaturedProperty } from "../../types/property";


const PAGE_SIZE = 8;

/** Maps a Supabase row to the Property interface */
function toProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    title: row.title as string,
    price: row.price as string,
    location: row.location as string,
    beds: Number(row.beds),
    baths: Number(row.baths),
    area: row.area as string,
    lat: Number(row.lat),
    lng: Number(row.lng),
    images: row.images as string[] ?? [],
    description: row.description as string ?? "",
    amenities: row.amenities as string[] ?? [],
    slug: row.slug as string,
    isRental: row.is_rental as boolean,
    statusTag: row.status_tag as string,
  };
}

function toFeaturedProperty(row: Record<string, unknown>): FeaturedProperty {
  return {
    ...toProperty(row),
    isFeatured: row.is_featured as boolean,
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: 'es' | 'en' | 'fr' }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // In Next.js 16, searchParams is a Promise — must await
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams.page;
  const currentPage = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : (pageParam ?? "1")));

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const hasActiveFilters = Boolean(
    resolvedParams.q ||
    (resolvedParams.type && resolvedParams.type !== 'All') ||
    resolvedParams.min_price ||
    resolvedParams.max_price ||
    (resolvedParams.beds && Number(resolvedParams.beds) > 0) ||
    (resolvedParams.baths && Number(resolvedParams.baths) > 0) ||
    resolvedParams.amenities
  );

  const supabase = await createClient();

  let nonFeaturedQuery = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: true });

  if (resolvedParams.q) {
    nonFeaturedQuery = nonFeaturedQuery.ilike('location', `%${resolvedParams.q}%`);
  }
  if (resolvedParams.type && resolvedParams.type !== 'All') {
    nonFeaturedQuery = nonFeaturedQuery.eq('property_type', resolvedParams.type);
  }
  if (resolvedParams.min_price) {
    nonFeaturedQuery = nonFeaturedQuery.gte('price_numeric', Number(resolvedParams.min_price));
  }
  if (resolvedParams.max_price) {
    nonFeaturedQuery = nonFeaturedQuery.lte('price_numeric', Number(resolvedParams.max_price));
  }
  if (resolvedParams.beds && Number(resolvedParams.beds) > 0) {
    nonFeaturedQuery = nonFeaturedQuery.gte('beds', Number(resolvedParams.beds));
  }
  if (resolvedParams.baths && Number(resolvedParams.baths) > 0) {
    nonFeaturedQuery = nonFeaturedQuery.gte('baths', Number(resolvedParams.baths));
  }
  if (resolvedParams.amenities) {
    const ams = (resolvedParams.amenities as string).split(',');
    nonFeaturedQuery = nonFeaturedQuery.contains('amenities', ams);
  }

  nonFeaturedQuery = nonFeaturedQuery.range(from, to);

  const [featuredResult, propertiesResult] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: true })
      .limit(2),
    nonFeaturedQuery,
  ]);

  const featuredProperties: FeaturedProperty[] =
    (featuredResult.data ?? []).map(toFeaturedProperty);

  const properties: Property[] =
    (propertiesResult.data ?? []).map(toProperty);

  const totalCount = propertiesResult.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="bg-[#EEF6F6] text-nordic-dark font-display antialiased selection:bg-mosque selection:text-white">
      <Navbar dict={dict.navbar} lang={lang} />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
              {dict.home.titleStart}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">{dict.home.titleHighlight}</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              {dict.home.titleEnd}
            </h1>

            <SearchFilters dict={dict.search} />
          </div>
        </section>

        {/* Featured Collections */}
        {!hasActiveFilters && featuredProperties.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">{dict.home.featuredCollections}</h2>
                <p className="text-nordic-muted mt-1 text-sm">{dict.home.featuredDesc}</p>
              </div>
              <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                {dict.home.viewAll} <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* New in Market — paginated */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">{dict.home.newInMarket}</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {dict.home.newDesc}{" "}
                <span className="text-nordic-dark/40 text-xs">
                  ({totalCount} {dict.home.propertiesCount})
                </span>
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">{dict.filters.all}</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">{dict.filters.buy}</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">{dict.filters.rent}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {/* Server-side pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
    </div>
  );
}
