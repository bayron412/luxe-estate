"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const lang = params.lang || "es";

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse ring-2 ring-transparent"></div>
    );
  }

  if (!user) {
    return (
      <Link href={`/${lang}/login`}>
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all flex items-center justify-center text-nordic-muted hover:text-mosque cursor-pointer">
          <span className="material-icons text-xl">person</span>
        </div>
      </Link>
    );
  }

  // Determine avatar
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "https://ui-avatars.com/api/?name=User&background=EEF6F6&color=19322F";

  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all cursor-default"
        title={user.email}
      >
        <img
          alt="Profile Avatar"
          className="w-full h-full object-cover"
          src={avatarUrl}
        />
      </div>

      <button
        onClick={handleSignOut}
        title="Cerrar sesión"
        className="flex items-center justify-center w-8 h-8 rounded-full text-nordic-dark/70 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <span className="material-icons text-[20px]">logout</span>
      </button>
    </div>
  );
}
