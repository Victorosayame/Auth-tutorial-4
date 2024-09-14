
//8.0

//an array of routes that are accessible to the public
//this routes do not require authentication
// @type {string[]}

export const publicRoutes = [
    "/",
    "/auth/new-verification"
];

//an array of routes that are used for authentication
//this routes will redirect logged in user to /settings
// @type {string[]}
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];

//The prefix for api authentication routes
//Routes that start with this prefix are used for api authentication purposes
// @type {string}
export const apiAuthPrefix = "/api/auth";

// default redirect path after logging in
// @type {string}
export const DEFAULT_LOGIN_REDIRECT = "/settings";