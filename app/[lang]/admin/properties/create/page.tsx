import React from "react";
import { getDictionary } from "../../../../../lib/dictionary";
import PropertyForm from "../../../../../components/Admin/PropertyForm";
import Link from "next/link";

export default async function CreatePropertyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="animate-fade-in-down">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link href={`/${lang}/admin/properties`} className="hover:text-mosque transition-colors">{dict.admin.properties}</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic">{dict.admin.addNew}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">{dict.admin.addNew}</h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
                Fill in the details below to create a new listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm dict={dict} lang={lang} />
    </div>
  );
}
