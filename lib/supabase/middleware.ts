import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Intentamos obtener al usuario para refrescar la sesion
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // DIAGNÓSTICO: ver qué cookies llegan al proxy
  const allCookieNames = request.cookies.getAll().map(c => c.name);
  console.log('[MIDDLEWARE] cookies recibidas:', allCookieNames.join(', ') || 'ninguna');
  console.log('[MIDDLEWARE] user:', user?.id ?? 'null', '| error:', userError?.message ?? 'none');

  // Si hay usuario autenticado, garantizar que tenga fila en user_roles
  if (user) {
    const { error: upsertError } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role: 'user' }, { onConflict: 'user_id', ignoreDuplicates: true });
    if (upsertError) {
      console.log('[MIDDLEWARE] upsert error:', upsertError.message);
    }
  }

  // Proteccion de rutas de admin
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('/admin')) {
    console.log('[MIDDLEWARE] Ruta admin detectada:', pathname);

    if (!user) {
      console.log('[MIDDLEWARE] Sin usuario → login');
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/(es|en|fr)/);
      const locale = localeMatch ? localeMatch[1] : 'es';
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    // Usar RPC con SECURITY DEFINER para evitar recursion circular de RLS
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', {
      p_user_id: user.id,
    });

    console.log('[MIDDLEWARE] is_admin result:', isAdmin, '| rpc error:', rpcError?.message ?? 'none');

    if (rpcError || !isAdmin) {
      console.log('[MIDDLEWARE] No es admin → homepage');
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/(es|en|fr)/);
      const locale = localeMatch ? localeMatch[1] : 'es';
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    console.log('[MIDDLEWARE] ES admin → permitiendo acceso');
  }

  return supabaseResponse;
}
