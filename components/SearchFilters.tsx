'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const categories = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'];
const allAmenitiesList = [
  { id: 'Swimming Pool', icon: 'pool' },
  { id: 'Gym', icon: 'fitness_center' },
  { id: 'Parking', icon: 'local_parking' },
  { id: 'Air Conditioning', icon: 'ac_unit' },
  { id: 'High-speed Wifi', icon: 'wifi' },
  { id: 'Patio / Terrace', icon: 'deck' }
];

export default function SearchFilters({ dict }: { dict?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal specific state
  const [locQuery, setLocQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propType, setPropType] = useState('Any Type');
  const [beds, setBeds] = useState('0');
  const [baths, setBaths] = useState('0');
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('type') || 'All');
    
    // Sync modal state with URL params
    setLocQuery(searchParams.get('q') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setPropType(searchParams.get('type') || 'Any Type');
    setBeds(searchParams.get('beds') || '0');
    setBaths(searchParams.get('baths') || '0');
    const am = searchParams.get('amenities');
    setAmenities(am ? am.split(',') : []);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    // reset to page 1 on new search
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('type');
    } else {
      params.set('type', category);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyModalFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (locQuery) params.set('q', locQuery);
    else params.delete('q');

    if (minPrice) params.set('min_price', minPrice.replace(/,/g, ''));
    else params.delete('min_price');

    if (maxPrice) params.set('max_price', maxPrice.replace(/,/g, ''));
    else params.delete('max_price');

    if (propType !== 'Any Type') params.set('type', propType);
    else params.delete('type');

    if (parseInt(beds) > 0) params.set('beds', beds);
    else params.delete('beds');

    if (parseInt(baths) > 0) params.set('baths', baths);
    else params.delete('baths');

    if (amenities.length > 0) params.set('amenities', amenities.join(','));
    else params.delete('amenities');

    params.set('page', '1');
    setIsModalOpen(false);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearModalFilters = () => {
    setLocQuery('');
    setMinPrice('');
    setMaxPrice('');
    setPropType('Any Type');
    setBeds('0');
    setBaths('0');
    setAmenities([]);
  };

  const toggleAmenity = (id: string) => {
    if (amenities.includes(id)) {
      setAmenities(amenities.filter(a => a !== id));
    } else {
      setAmenities([...amenities, id]);
    }
  };

  return (
    <>
      <div className="relative group max-w-2xl mx-auto animate-fade-in-down">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <span className="material-symbols-rounded text-gray-400 text-2xl group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input
          className="block w-full pl-14 pr-4 py-5 rounded-2xl border-none bg-white text-nordic shadow-soft-hover placeholder-gray-400 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
          placeholder={dict?.placeholder || "Search by city, neighborhood, or address..."}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="absolute inset-y-2.5 right-2.5 px-8 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/20"
        >
          {dict?.button || "Search"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4 mt-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              selectedCategory === cat
                ? 'bg-nordic text-white shadow-lg shadow-nordic/20 -translate-y-0.5'
                : 'bg-white border border-gray-100 text-gray-400 hover:text-nordic hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            {dict?.categories?.[cat] || cat}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-100 text-nordic font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
        >
          <span className="material-symbols-rounded text-lg">tune</span> {dict?.filters || "Filters"}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-nordic/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <main className="relative z-[101] w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in text-left">
            <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
              <h1 className="text-2xl font-semibold tracking-tight text-nordic">{dict?.modal?.title || "Filters"}</h1>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                <span className="material-symbols-rounded">close</span>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
              <section>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{dict?.modal?.location || "Location"}</label>
                <div className="relative group">
                  <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">location_on</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-background-light border-0 rounded-xl text-nordic placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm font-medium" 
                    placeholder={dict?.modal?.locPlaceholder || "City, neighborhood, or address"}
                    type="text" 
                    value={locQuery}
                    onChange={(e) => setLocQuery(e.target.value)}
                  />
                </div>
              </section>

              <section>
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{dict?.modal?.priceRange || "Price Range"}</label>
                  <span className="text-sm font-bold text-primary">
                    {minPrice || "0"} – {maxPrice || (dict?.modal?.any || "Any")}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background-light p-3.5 rounded-xl border border-transparent focus-within:border-primary/30 transition-colors">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">{dict?.modal?.minPrice || "Min Price"}</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1.5 font-bold">$</span>
                      <input 
                        className="w-full bg-transparent border-0 p-0 text-nordic font-bold focus:ring-0 text-sm" 
                        type="text" 
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bg-background-light p-3.5 rounded-xl border border-transparent focus-within:border-primary/30 transition-colors">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">{dict?.modal?.maxPrice || "Max Price"}</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1.5 font-bold">$</span>
                      <input 
                        className="w-full bg-transparent border-0 p-0 text-nordic font-bold focus:ring-0 text-sm" 
                        type="text" 
                        placeholder={dict?.modal?.any || "Any"}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{dict?.modal?.propertyType || "Property Type"}</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-background-light border-0 rounded-xl py-3.5 pl-4 pr-10 text-nordic font-bold appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      value={propType}
                      onChange={(e) => setPropType(e.target.value)}
                    >
                      <option value="Any Type">{dict?.modal?.anyType || "Any Type"}</option>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{dict?.categories?.[cat] || cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-rounded absolute right-3 top-3.5 text-gray-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-nordic">{dict?.modal?.bedrooms || "Bedrooms"}</span>
                    <div className="flex items-center space-x-4 bg-background-light rounded-full p-1.5">
                      <button onClick={(e) => { e.preventDefault(); setBeds(Math.max(0, parseInt(beds)-1).toString()) }} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-95">
                        <span className="material-symbols-rounded text-lg leading-none">remove</span>
                      </button>
                      <span className="text-sm font-bold w-6 text-center tabular-nums">{parseInt(beds) > 0 ? `${beds}+` : (dict?.modal?.any || 'Any')}</span>
                      <button onClick={(e) => { e.preventDefault(); setBeds((parseInt(beds)+1).toString()) }} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
                        <span className="material-symbols-rounded text-lg leading-none">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-nordic">{dict?.modal?.bathrooms || "Bathrooms"}</span>
                    <div className="flex items-center space-x-4 bg-background-light rounded-full p-1.5">
                      <button onClick={(e) => { e.preventDefault(); setBaths(Math.max(0, parseInt(baths)-1).toString()) }} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-95">
                        <span className="material-symbols-rounded text-lg leading-none">remove</span>
                      </button>
                      <span className="text-sm font-bold w-6 text-center tabular-nums">{parseInt(baths) > 0 ? `${baths}+` : (dict?.modal?.any || 'Any')}</span>
                      <button onClick={(e) => { e.preventDefault(); setBaths((parseInt(baths)+1).toString()) }} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
                        <span className="material-symbols-rounded text-lg leading-none">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{dict?.modal?.amenities || "Amenities & Features"}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allAmenitiesList.map((am) => {
                    const isActive = amenities.includes(am.id);
                    return (
                      <label key={am.id} className="cursor-pointer group relative" onClick={(e) => { e.preventDefault(); toggleAmenity(am.id) }}>
                        <div className={`h-full px-5 py-4 rounded-xl border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all ${isActive ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-400 hover:border-primary/20 hover:bg-primary/5'}`}>
                          <span className={`material-symbols-rounded text-xl ${isActive ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}`}>{am.icon}</span>
                          {dict?.amenitiesList?.[am.id] || am.id}
                        </div>
                        {isActive && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full shadow-sm animate-pulse"></div>}
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>
            
            <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
              <button onClick={clearModalFilters} className="text-sm font-bold text-gray-400 hover:text-nordic transition-colors underline decoration-gray-200 underline-offset-8 decoration-2">
                {dict?.modal?.clearAll || "Clear all filters"}
              </button>
              <button onClick={applyModalFilters} className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95">
                {dict?.modal?.showResults || "Show Results"}
                <span className="material-symbols-rounded text-base">arrow_forward</span>
              </button>
            </footer>
          </main>
        </div>
      )}
    </>
  );
}
