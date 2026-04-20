import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Detectar el locale desde la cookie del request entrante
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "es";
  const next = searchParams.get("next") ?? `/${locale}`;

  if (code) {
    // Crear la respuesta de redirección PRIMERO para poder setear las cookies directamente en ella
    const redirectResponse = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            // Leer cookies del request entrante
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Escribir cookies directamente en el response de redirección
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectResponse;
    }

    console.error("[AUTH CALLBACK] Error exchanging code:", error.message);
  }

  // Si algo falla, redirigir al login
  return NextResponse.redirect(`${origin}/${locale}/login`);
}
