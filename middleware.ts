import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['es', 'en', 'fr'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  // 1. Check cookie
  if (request.cookies.has('NEXT_LOCALE')) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value;
    if (locale && locales.includes(locale)) {
      return locale;
    }
  }

  // 2. Fallback to Accept-Language or default
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle asset files, _next internal files, API routes, and public files like favicon.ico
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    pathname.startsWith('/propiedades') === false && pathname.length > 1 && !locales.some(loc => pathname.startsWith(`/${loc}`)) 
  ) {
    // wait, if it's not a locale, and not an internal route, we should redirect.
    // Let's refine the logic for ignoring files:
  }
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // We only want to handle top level paths or things that should be localized.
  // Ignore static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(.*)$/) 
  ) {
    return;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  const response = NextResponse.redirect(request.nextUrl);
  // Also make sure to set the cookie if it wasn't already set
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000 // 1 year
  });
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|_vercel|.*\\..*).*)',
  ],
};
