"use server";

import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("[AUTH] signInWithGoogle error:", error.message);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithGitHub() {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("[AUTH] signInWithGitHub error:", error.message);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}
