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
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">search</span>
        </div>
        <input
          className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-[rgba(92,112,109,0.6)] focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
          placeholder={dict?.placeholder || "Search by city, neighborhood, or address..."}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
        >
          {dict?.button || "Search"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4 mt-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 hover:-translate-y-0.5'
                : 'bg-white border text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
            }`}
          >
            {dict?.categories?.[cat] || cat}
          </button>
        ))}

        <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
        >
          <span className="material-icons text-base">tune</span> {dict?.filters || "Filters"}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <main className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
              <h1 className="text-2xl font-semibold tracking-tight text-nordic-dark">{dict?.modal?.title || "Filters"}</h1>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-nordic-muted">
                <span className="material-icons">close</span>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
              <section>
                <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">{dict?.modal?.location || "Location"}</label>
                <div className="relative group">
                  <span className="material-icons absolute left-4 top-3.5 text-nordic-muted group-focus-within:text-mosque transition-colors">location_on</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-[#EEF6F6] border-0 rounded-lg text-nordic-dark placeholder-nordic-muted focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm" 
                    placeholder={dict?.modal?.locPlaceholder || "City, neighborhood, or address"}
                    type="text" 
                    value={locQuery}
                    onChange={(e) => setLocQuery(e.target.value)}
                  />
                </div>
              </section>

              <section>
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">{dict?.modal?.priceRange || "Price Range"}</label>
                  <span className="text-sm font-medium text-mosque">{dict?.modal?.any || "Any"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#EEF6F6] p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                    <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">{dict?.modal?.minPrice || "Min Price"}</label>
                    <div className="flex items-center">
                      <span className="text-nordic-muted mr-1">$</span>
                      <input 
                        className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm" 
                        type="text" 
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bg-[#EEF6F6] p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                    <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">{dict?.modal?.maxPrice || "Max Price"}</label>
                    <div className="flex items-center">
                      <span className="text-nordic-muted mr-1">$</span>
                      <input 
                        className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm" 
                        type="text" 
                        placeholder={dict?.modal?.any || "Any"}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">{dict?.modal?.propertyType || "Property Type"}</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#EEF6F6] border-0 rounded-lg py-3 pl-4 pr-10 text-nordic-dark appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                      value={propType}
                      onChange={(e) => setPropType(e.target.value)}
                    >
                      <option value="Any Type">{dict?.modal?.anyType || "Any Type"}</option>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{dict?.categories?.[cat] || cat}</option>
                      ))}
                    </select>
                    <span className="material-icons absolute right-3 top-3 text-nordic-muted pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-nordic-dark">{dict?.modal?.bedrooms || "Bedrooms"}</span>
                    <div className="flex items-center space-x-3 bg-[#EEF6F6] rounded-full p-1">
                      <button onClick={(e) => { e.preventDefault(); setBeds(Math.max(0, parseInt(beds)-1).toString()) }} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque transition-colors">
                        <span className="material-icons text-base">remove</span>
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{parseInt(beds) > 0 ? `${beds}+` : (dict?.modal?.any || 'Any')}</span>
                      <button onClick={(e) => { e.preventDefault(); setBeds((parseInt(beds)+1).toString()) }} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                        <span className="material-icons text-base">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-nordic-dark">{dict?.modal?.bathrooms || "Bathrooms"}</span>
                    <div className="flex items-center space-x-3 bg-[#EEF6F6] rounded-full p-1">
                      <button onClick={(e) => { e.preventDefault(); setBaths(Math.max(0, parseInt(baths)-1).toString()) }} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque transition-colors">
                        <span className="material-icons text-base">remove</span>
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{parseInt(baths) > 0 ? `${baths}+` : (dict?.modal?.any || 'Any')}</span>
                      <button onClick={(e) => { e.preventDefault(); setBaths((parseInt(baths)+1).toString()) }} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors">
                        <span className="material-icons text-base">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">{dict?.modal?.amenities || "Amenities & Features"}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAmenitiesList.map((am) => {
                    const isActive = amenities.includes(am.id);
                    return (
                      <label key={am.id} className="cursor-pointer group relative" onClick={(e) => { e.preventDefault(); toggleAmenity(am.id) }}>
                        <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${isActive ? 'border-mosque bg-mosque/5 text-mosque font-medium' : 'border-gray-200 bg-white text-nordic-muted hover:border-gray-300'}`}>
                          <span className={`material-icons text-lg ${isActive ? '' : 'text-gray-400 group-hover:text-gray-500'}`}>{am.icon}</span>
                          {dict?.amenitiesList?.[am.id] || am.id}
                        </div>
                        {isActive && <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"></div>}
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>
            
            <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
              <button onClick={clearModalFilters} className="text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors underline decoration-gray-300 underline-offset-4">
                {dict?.modal?.clearAll || "Clear all filters"}
              </button>
              <button onClick={applyModalFilters} className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all flex items-center gap-2">
                {dict?.modal?.showResults || "Show Results"}
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </footer>
          </main>
        </div>
      )}
    </>
  );
}
