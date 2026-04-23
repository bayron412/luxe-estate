import React from "react";
import { getDictionary } from "../../../../../../lib/dictionary";
import PropertyForm from "../../../../../../components/Admin/PropertyForm";
import { createClient } from "../../../../../../lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ lang: "en" | "es" | "fr", id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single();

  if (!property) {
    redirect(`/${lang}/admin/properties`);
  }

  return (
    <div className="animate-fade-in-down">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link href={`/${lang}/admin/properties`} className="hover:text-mosque transition-colors">{dict.admin.properties}</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic">{dict.admin.propertyDetails}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">Edit: {property.title}</h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
                Update the details below.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm dict={dict} lang={lang} initialData={property} />
    </div>
  );
}
