import { geolocation, next } from '@vercel/edge';

// List of blocked countries (ISO 3166-1 alpha-2 country codes)
// North Korea (KP), Iran (IR), Syria (SY), Cuba (CU), Crimea (UA-43), Luhansk (UA-09), Donetsk (UA-14)
const BLOCKED_COUNTRIES = [
  'KP',
  'IR',
  'SY',
  'CU',
  'UA-43',
  'UA-09',
  'UA-14',
  'UNKNOWN',
];

export const config = {
  matcher: ['/'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { country } = geolocation(request);
  const countryCode = country || 'UNKNOWN';

  if (
    BLOCKED_COUNTRIES.includes(countryCode) &&
    url.pathname !== '/restricted'
  ) {
    url.pathname = '/restricted';
    return Response.redirect(url);
  }

  return next();
}
