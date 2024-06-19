import { NextRequest,NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// this file is used for any middle work that is to be done 

// This function can be marked `async` if using `await` inside

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    const url = request.nextUrl;// currently present on which url
    
    if (token &&
        (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')
        )
    ) {
        NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    
      return NextResponse.next();  //itna hi kaam kart raha hai middleware
}
 
// config contains all the paths where we actually want the middle ware to run
