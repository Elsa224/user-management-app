import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "fr"],

    // Used when no locale matches
    defaultLocale: "en",

    // The pathname prefix for each locale
    pathnames: {
        "/": "/",
        "/login": {
            en: "/login",
            fr: "/connexion",
        },
        "/dashboard": {
            en: "/dashboard",
            fr: "/tableau-de-bord",
        },
        "/users": {
            en: "/users",
            fr: "/utilisateurs",
        },
    },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
