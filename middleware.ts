import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { parse } from "cookie";
import { getSessionServer } from "./lib/api/serverApi";

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
    const cookiesStoreData = await cookies();
    const accessToken = cookiesStoreData.get('accessToken')?.value;
    const refreshToken = cookiesStoreData.get('refreshToken')?.value;
    
    const { pathname } = request.nextUrl;
    const isPrivateRoute = privateRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isPrivateRoute) {
        const response = await getSessionServer();
        const responseCookies = response.headers['set-cookie'];

        if (responseCookies) {
            const arr = Array.isArray(responseCookies) ? responseCookies : [responseCookies];
            for (const cookieEl of arr) {
                if (cookieEl) {
                    const parsed = parse(cookieEl); 
                    const options: Partial<ResponseCookie> = {
                        maxAge: Number(parsed['Max-Age']),
                        path: parsed.Path,
                        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                    };

                    if (parsed.accessToken) {
                        cookiesStoreData.set('accessToken', parsed.accessToken, options)
                    }
                    
                    if (parsed.refreshToken) {
                        cookiesStoreData.set('refreshToken', parsed.refreshToken, options) 
                    } 
                }
                return NextResponse.next({
                    headers: {
                        Cookie: cookiesStoreData.toString(),
                    }
                })
            }
        }

        return NextResponse.redirect(new URL('/login',request.nextUrl.origin))
    }

    if (isPublicRoute) {
        if (accessToken) {
            return NextResponse.redirect(new URL('/',request.nextUrl.origin))
        };

        if (refreshToken) {
            const response = await getSessionServer();
            const responseCookies = response.headers['set-cookie'];

            if (responseCookies) {
                const arr = Array.isArray(responseCookies) ? responseCookies : [responseCookies];
                for (const cookieEL of arr) {
          if (cookieEL) {
            const parsed = parse(cookieEL)
            const options: Partial<ResponseCookie> = {
              maxAge: Number(parsed['Max-Age']),
              path: parsed.Path,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            }
            if (parsed.accessToken) {
              cookiesStoreData.set('accessToken', parsed.accessToken, options)
            }
            if (parsed.refreshToken) {
              cookiesStoreData.set('refreshToken', parsed.refreshToken, options)
            }
          }
          return NextResponse.redirect(new URL('/', request.nextUrl.origin))
        }
      }
      return NextResponse.next()
    }
    return NextResponse.next()
  }
}

export const config = { matcher: ['/profile/:path*', '/login', '/register', '/notes/:path*'] }
