import React from "react";
import Link from "next/link";
import { getDictionary } from "../../../lib/dictionary";
import { createClient } from "../../../lib/supabase/server";
import AdminNav from "./AdminNav";
import LogoutButton from "../../../components/LogoutButton";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "es" | "en" | "fr");
  const supabase = await createClient();

  // Get current user auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background-light font-display flex flex-col antialiased text-nordic">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Link href={`/${lang}`} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">H</div>
              <span className="font-bold text-xl tracking-tight text-nordic">Haven</span>
            </Link>
            <AdminNav lang={lang} dict={dict.admin} />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
              <span className="material-icons text-xl">notifications_none</span>
            </button>
            <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-nordic truncate max-w-[120px]">
                  {user?.email?.split("@")[0] || "Alex Morgan"}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Premium Agent</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white ring-1 ring-primary/5 shadow-sm">
                {user?.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-lg">person</span>
                )}
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-primary/10 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="text-xs text-gray-400">
            © 2023 Haven Property Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
