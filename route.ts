// Define the prefix for API authentication routes
export const apiAuthPrefix = "/api/auth"; // Prefix for all API routes related to authentication

// Define routes that require authentication
export const authRoutes = [
    "/internal" // Route for internal pages that require user authentication
];

// Define the default redirect path after login
export const DEFAULT_LOGIN_REDIRECT = "/"; // Default redirect to the home page after successful login