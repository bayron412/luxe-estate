import React from "react";
import Link from "next/link";
import { getDictionary } from "../../../lib/dictionary";
import { createClient } from "../../../lib/supabase/server";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: "es" | "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  // Get current user auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#EEF6F6] font-display flex flex-col md:flex-row antialiased text-nordic-dark">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#D9ECC8] shadow-sm flex flex-col">
        <div className="p-6 border-b border-[#EEF6F6]">
          <Link href={`/${lang}/admin`} className="flex items-center gap-2">
            <span className="material-icons text-mosque">dashboard</span>
            <h2 className="text-xl font-bold bg-gradient-to-r from-mosque to-[#D9ECC8] bg-clip-text text-transparent">
              {dict.admin.dashboard}
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href={`/${lang}/admin`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#EEF6F6] transition-colors text-nordic-dark/80 hover:text-mosque"
          >
            <span className="material-icons text-lg">real_estate_agent</span>
            {dict.admin.properties}
          </Link>
          <Link
            href={`/${lang}/admin/users`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#EEF6F6] transition-colors text-nordic-dark/80 hover:text-mosque"
          >
            <span className="material-icons text-lg">group</span>
            {dict.admin.users}
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#EEF6F6]">
           <div className="mb-4 px-4">
             <p className="text-xs text-nordic-dark/50">{dict.admin.email}</p>
             <p className="text-sm font-medium truncate" title={user?.email}>{user?.email}</p>
           </div>
           <Link
            href={`/${lang}`}
            className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-mosque font-medium hover:underline"
          >
            <span className="material-icons text-sm">arrow_back</span>
            {dict.admin.backToSite}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
