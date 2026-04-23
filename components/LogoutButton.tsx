"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      title="Cerrar sesión"
      className="flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-sm sm:shadow-none"
    >
      <span className="material-symbols-rounded text-[22px]">logout</span>
    </button>
  );
}
