import { auth as middleware } from "@/auth"
import { apiAuthPrefix, authRoutes } from "./route";

export default middleware((req) => {
    const { nextUrl } = req; // Extract the nextUrl from the request
    const isLoggedIn = !!req.auth; // Determine if the user is logged in by checking if req.auth is truthy

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // Check if the current route is an API authentication route
    const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Check if the current route is one of the authentication routes

    if (isApiAuthRoute) return; // If the route is an API authentication route, do nothing

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/", nextUrl)); // If the user is logged in and trying to access an authentication route, redirect to the home page
        }
        return; // If the user is not logged in, do nothing (allow access to the authentication route)
    }

    if (isLoggedIn) return; // If the user is logged in and not on an authentication route, do nothing (allow access)

    if (!isLoggedIn) {
        return Response.redirect(new URL("/internal", nextUrl)); // If the user is not logged in and trying to access a protected route, redirect to the internal page
    }

    return; // Default return if none of the conditions match
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'], // Define the paths that the middleware should match
};