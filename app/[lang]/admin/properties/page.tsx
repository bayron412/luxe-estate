import React from "react";
import { getDictionary } from "../../../../lib/dictionary";
import { createClient } from "../../../../lib/supabase/server";

export default async function AdminPropertiesPage({
  params,
}: {
  params: Promise<{ lang: "es" | "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const totalListings = properties?.length || 0;
  const activeProperties = properties?.filter(p => p.status_tag?.toLowerCase() === "active" || !p.status_tag).length || 0;
  const pendingProperties = properties?.filter(p => p.status_tag?.toLowerCase() === "pending" || p.is_rental).length || 0;

  return (
    <div className="animate-fade-in-down">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic tracking-tight">
            {dict.admin.myProperties}
          </h1>
          <p className="text-gray-500 mt-1">{dict.admin.portfolioDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-nordic hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> {dict.admin.filter}
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> {dict.admin.addNew}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between transition-all hover:shadow-soft group">
          <div>
            <p className="text-sm font-medium text-gray-500">{dict.admin.totalListings}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between transition-all hover:shadow-soft group">
          <div>
            <p className="text-sm font-medium text-gray-500">{dict.admin.activeProperties}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{activeProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between transition-all hover:shadow-soft group">
          <div>
            <p className="text-sm font-medium text-gray-500">{dict.admin.pendingSale}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{pendingProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">{dict.admin.propertyDetails}</div>
          <div className="col-span-2">{dict.admin.price}</div>
          <div className="col-span-2">{dict.admin.status}</div>
          <div className="col-span-2 text-right">{dict.admin.actions}</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-50">
          {properties?.map((property) => {
            const isSold = property.status_tag?.toLowerCase() === "sold";
            const isPending = property.status_tag?.toLowerCase() === "pending" || property.is_rental;
            const isActive = !isSold && !isPending;

            return (
              <div
                key={property.id}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-background-light transition-colors items-center"
              >
                {/* Property Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="material-icons">image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-nordic group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{property.location}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bed</span> {property.beds} {dict.property.bedrooms}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bathtub</span> {property.baths} {dict.property.bathrooms}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{property.area?.toLocaleString() || "0"} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 md:col-span-2">
                  <div className="text-base font-semibold text-nordic">{property.price}</div>
                  <div className="text-xs text-gray-400">
                    {property.is_rental ? `${dict.admin.monthly}: ${property.price}` : ""}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-6 md:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isActive ? "bg-hint-green text-primary border-primary/10" :
                    isPending ? "bg-orange-100 text-orange-700 border-orange-200" :
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      isActive ? "bg-primary" :
                      isPending ? "bg-orange-500" :
                      "bg-gray-500"
                    }`}></span>
                    {isActive ? dict.admin.active : isPending ? dict.admin.pending : dict.admin.sold}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all"
                    title={dict.admin.editRole}
                  >
                    <span className="material-icons text-xl">edit</span>
                  </button>
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title={dict.admin.actions}
                  >
                    <span className="material-icons text-xl">delete_outline</span>
                  </button>
                </div>
              </div>
            );
          })}

          {(!properties || properties.length === 0) && (
            <div className="px-6 py-20 text-center text-gray-400 bg-gray-50/30">
              <span className="material-icons text-4xl mb-2 block opacity-20">apartment</span>
              No properties configured.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-sm text-gray-500">
            {dict.admin.showing} <span className="font-medium text-nordic">1</span> {dict.admin.to}{" "}
            <span className="font-medium text-nordic">{properties?.length || 0}</span> {dict.admin.of}{" "}
            <span className="font-medium text-nordic">{properties?.length || 0}</span> {dict.admin.results}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-white transition-colors disabled:opacity-50">
              {dict.admin.previous}
            </button>
            <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-white transition-colors">
              {dict.admin.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
