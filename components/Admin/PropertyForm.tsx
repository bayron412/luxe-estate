"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PropertyForm({
  dict,
  lang,
  initialData,
}: {
  dict: any;
  lang: string;
  initialData?: any;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    price: initialData?.price || "",
    status_tag: initialData?.status_tag || "Active",
    property_type: initialData?.property_type || "apartment",
    description: initialData?.description || "",
    location: initialData?.location || "",
    area: initialData?.area || "",
    year_built: initialData?.year_built || "",
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    parking: initialData?.parking || 0,
    amenities: initialData?.amenities || [],
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  const availableAmenities = [
    "Swimming Pool",
    "Garden",
    "Air Conditioning",
    "Smart Home",
    "Gym",
    "Parking",
    "High-speed Wifi",
    "Patio / Terrace"
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (id: string, delta: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: Math.max(0, Number(prev[id]) + delta),
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev: any) => {
      const current = prev.amenities;
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter((a: string) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const files = Array.from(e.target.files);
      const newImages: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }

      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const price_numeric = parseInt(formData.price.replace(/[^0-9]/g, ''), 10) || 0;
      const is_rental = formData.status_tag.toLowerCase() === "for rent";

      const payload = {
        title: formData.title,
        price: formData.price,
        price_numeric,
        status_tag: formData.status_tag,
        property_type: formData.property_type,
        description: formData.description,
        location: formData.location,
        area: formData.area ? String(formData.area) : "",
        year_built: formData.year_built ? Number(formData.year_built) : null,
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        parking: Number(formData.parking),
        amenities: formData.amenities,
        images,
        slug: initialData ? initialData.slug : slug,
        is_rental,
        lat: initialData?.lat || 34.0522,
        lng: initialData?.lng || -118.2437,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([payload]);
        if (error) throw error;
      }

      router.push(`/${lang}/admin/properties`);
      router.refresh();
    } catch (error: any) {
      console.error("Error saving property:", error, JSON.stringify(error));
      alert(error.message || "An error occurred while saving the property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-24">
      {/* Header section integrated here or in the page. We keep it in the page layout usually, but the design shows Save buttons on top and bottom. Let's rely on the page for the top header and bottom buttons, or just bottom buttons here */}
      
      <div className="xl:col-span-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">{dict.admin.basicInformation || "Basic Information"}</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">
                {dict.admin.propertyTitle || "Property Title"} <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro"
                placeholder={dict.admin.propertyTitlePlaceholder || "e.g. Modern Penthouse with Ocean View"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">
                  {dict.admin.price || "Price"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input
                    id="price"
                    type="text"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-medium font-sf-pro"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status_tag">
                  {dict.admin.status || "Status"}
                </label>
                <select
                  id="status_tag"
                  value={formData.status_tag}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="Active">{dict.admin.active || "Active"}</option>
                  <option value="For Rent">{dict.admin.forRent || "For Rent"}</option>
                  <option value="Sold">{dict.admin.sold || "Sold"}</option>
                  <option value="Pending">{dict.admin.pending || "Pending"}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="property_type">
                  {dict.admin.propertyType || "Property Type"}
                </label>
                <select
                  id="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="apartment">{dict.admin.apartment || "Apartment"}</option>
                  <option value="house">{dict.admin.house || "House"}</option>
                  <option value="villa">{dict.admin.villa || "Villa"}</option>
                  <option value="commercial">{dict.admin.commercial || "Commercial"}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">{dict.admin.description || "Description"}</h2>
          </div>
          <div className="p-8">
            <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_bold</span>
              </button>
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_italic</span>
              </button>
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_list_bulleted</span>
              </button>
            </div>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]"
              placeholder={dict.admin.descriptionPlaceholder || "Describe the property..."}
            ></textarea>
            <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
              {formData.description.length} / 2000 characters
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">{dict.admin.gallery || "Gallery"}</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-primary/40 transition-colors cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
                  {uploading ? (
                     <span className="material-icons text-2xl animate-spin">refresh</span>
                  ) : (
                    <span className="material-icons text-2xl">cloud_upload</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic font-sf-pro">
                    {uploading ? "Uploading..." : dict.admin.clickOrDragImages || "Click or drag images here"}
                  </p>
                  <p className="text-xs text-gray-400 font-sf-pro">
                    {dict.admin.maxFileSize || "Max file size 5MB per image"}
                  </p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-hint-green/20 transition-all group"
                >
                  <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                  <span className="text-xs mt-1 font-medium font-sf-pro">{dict.admin.addMore || "Add More"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">{dict.admin.location || "Location"}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">
                {dict.admin.address || "Address"}
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-sf-pro"
                placeholder={dict.admin.addressPlaceholder || "Street Address, City, Zip"}
              />
            </div>
            {/* Map Preview Mockup as per HTML */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8" alt="Map view" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold font-sf-pro flex items-center gap-1">
                  <span className="material-icons text-sm text-primary">map</span> {dict.admin.preview || "Preview"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">{dict.admin.details || "Details"}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">
                  {dict.admin.areaSqM || "Area (m²)"}
                </label>
                <input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro text-sm"
                  placeholder="0"
                />
              </div>
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year_built">
                  {dict.admin.yearBuilt || "Year Built"}
                </label>
                <input
                  id="year_built"
                  type="number"
                  value={formData.year_built}
                  onChange={handleInputChange}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro text-sm"
                  placeholder={dict.admin.yearPlaceholder || "YYYY"}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> {dict.search?.modal?.bedrooms || "Bedrooms"}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => handleNumberChange("beds", -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={formData.beds} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => handleNumberChange("beds", 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> {dict.search?.modal?.bathrooms || "Bathrooms"}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => handleNumberChange("baths", -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={formData.baths} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => handleNumberChange("baths", 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> {dict.admin.parking || "Parking"}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => handleNumberChange("parking", -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={formData.parking} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => handleNumberChange("parking", 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">
                {dict.search?.modal?.amenities || "Amenities"}
              </h3>
              <div className="space-y-2">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">
                      {dict.search?.amenitiesList?.[amenity] || amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:relative md:bg-transparent md:border-none md:shadow-none md:p-0 md:col-span-12 z-40 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 md:py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm"
        >
          {dict.admin.cancel || "Cancel"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 md:py-2.5 rounded-lg bg-primary hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm disabled:opacity-50"
        >
          {loading ? (
            <span className="material-icons text-sm animate-spin">refresh</span>
          ) : (
            <span className="material-icons text-sm">save</span>
          )}
          {dict.admin.saveProperty || "Save Property"}
        </button>
      </div>
    </form>
  );
}
