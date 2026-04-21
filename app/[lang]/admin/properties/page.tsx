import React from "react";
import { getDictionary } from "../../../../lib/dictionary";
import { createClient } from "../../../../lib/supabase/server";
import Image from "next/image";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">
          {dict.admin.properties}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-[#EEF6F6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-mosque/5 text-mosque border-b border-[#EEF6F6] text-sm">
                <th className="px-6 py-4 font-semibold">Propiedad</th>
                <th className="px-6 py-4 font-semibold">Ubicación</th>
                <th className="px-6 py-4 font-semibold">Precio</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">{dict.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF6F6]">
              {properties?.map((property) => (
                <tr key={property.id} className="hover:bg-[#EEF6F6]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {property.images && property.images.length > 0 ? (
                           <img 
                             src={property.images[0]} 
                             alt={property.title} 
                             className="object-cover w-full h-full"
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-200">
                             <span className="material-icons text-gray-400 text-sm">image</span>
                           </div>
                        )}
                      </div>
                      <div className="font-medium text-nordic-dark truncate max-w-[200px]" title={property.title}>
                        {property.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-nordic-dark/70">
                    {property.location}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-mosque">
                    {property.price}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${property.is_rental ? "bg-blue-100 text-blue-800" : "bg-[#D9ECC8] text-mosque"}`}>
                      {property.is_rental ? dict.property.rental : dict.home.newDesc.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-nordic-dark/50 hover:text-mosque transition-colors p-2 rounded-full hover:bg-mosque/10" title={dict.admin.actions}>
                      <span className="material-icons text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {(!properties || properties.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-nordic-dark/50">
                    No hay propiedades configuradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
