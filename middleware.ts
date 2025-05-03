// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/auth';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// const protectedRoutes = ['/user-info'];

// const intlMiddleware = createMiddleware(routing);

// export default async function middleware(request: NextRequest) {
//   const session = await auth();
//   const { pathname } = request.nextUrl;

//   const isProtected = protectedRoutes.some((route) =>
//     pathname === route || pathname.startsWith(`${route}/`) ||
//     routing.locales.some((locale) =>
//       pathname === `/${locale}${route}` || pathname.startsWith(`/${locale}${route}/`)
//     )
//   );

//   if (isProtected && !session) {
//     const localeMatch = routing.locales.find((locale) =>
//       pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//     );
//     const locale = localeMatch || routing.defaultLocale;
//     return NextResponse.redirect(new URL(`/log-in`, request.url));
//   }

//   // Apply i18n middleware logic in all cases
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from "@/auth";

const protectedRoutes = ["/dashboard"];

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`) ||
    routing.locales.some((locale) =>
      pathname === `/${locale}${route}` || pathname.startsWith(`/${locale}${route}/`)
    )
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};