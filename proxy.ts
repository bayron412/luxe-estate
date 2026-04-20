import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const locales = ['es', 'en', 'fr'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  if (request.cookies.has('NEXT_LOCALE')) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value;
    if (locale && locales.includes(locale)) {
      return locale;
    }
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle internal files, API routes, public static files y rutas de auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||   // ← excluir /auth/callback y similares
    pathname.includes('.') 
  ) {
    return;
  }

  
  // 1. Refrescar sesion y chequear rutas protegidas de Supabase
  const supabaseResponse = await updateSession(request);

  // Si Supabase decidio redirigir por seguridad (ej: user no admin), retornamos esa redireccion
  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse;
  }

  // 2. Manejo de Locales si no hay redireccion previa
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return supabaseResponse;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  const redirectResponse = NextResponse.redirect(request.nextUrl);
  // Maintain cookies set by supabase inside redirect
  supabaseResponse.cookies.getAll().forEach(cookie => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  redirectResponse.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000 // 1 year
  });
  
  return redirectResponse;
}

export const config = {
  matcher: [
    '/((?!_next|api|auth|favicon.ico|_vercel|.*\\..*).*)',
  ],
};
